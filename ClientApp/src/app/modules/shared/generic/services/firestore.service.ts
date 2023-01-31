import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from './crud.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirestoreBatchService } from './firestore.batch.service';
import { getFirestoreQuery, withUidAndConvertedDates } from './utils/FirestoreUtils';
import { PropertyFilter, EntityFilterOperator, PropertyFilterMatchCriteria } from '../filters/filtering/PropertyFilter';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';
import { getFilterKey } from '../filters/filters.helper';


export abstract class FirestoreService<T extends IdentificableItem> extends CrudService<T> {
    batch: firebase.default.firestore.WriteBatch | null = null;
    transaction: firebase.default.firestore.Transaction | null = null;
    abstract collection: AngularFirestoreCollection<T>
    isWriteBatchActive = false;

    constructor(private batchService: FirestoreBatchService, private angularFirestore : AngularFirestore) {
        super();
        this.batchService.globalBatchRef.subscribe(ref => this.batch = ref);
        this.batchService.globalTransactionRef.subscribe(ref => this.transaction = ref);
    }

    public override setQueryContext(parentEntityName: string, parentId: string, context: string, nestRecursively : boolean  = false) {

        if (nestRecursively)
            this.collection = this.collection.doc(parentId).collection<T>(context);

        else {
            //this.collection = this.collection.ref.parent?.parent.doc(parentId).collection(context);
            let parentDoc = this.collection.ref.parent;
            if (!parentDoc) {
                this.collection = this.collection.doc(parentId).collection<T>(context);
            }
            else
                this.collection = this.angularFirestore.collection<T>(parentDoc.parent.path).doc(parentId).collection<T>(context);


        }  
        let filter = new PropertyFilter(parentEntityName, parentId, PropertyFilterMatchCriteria.EQUALS, context);
        this.setSubsetKey(getFilterKey(filter));
    }

    //method to communicate with Backend
    protected override createItemInternal(item: T): Promise<T | undefined> {
        return new Promise<T | undefined>((res, rej) => {
            this.collection.add(item).then(result => {
                result.get().then(e => {
                    if (e.exists && e.data()) {
                        res(withUidAndConvertedDates(e.data()!,e.id))
                    }
                    else {
                        res(undefined)
                    }
                })
            }).catch((err: Error) => {
                rej(err);
            })
        })
    }


    protected override readItemsInternal(): Promise<T[] | undefined> {
        return new Promise<T[] | undefined>((res,rej) => {
            this.collection.ref.get().then(data => {
                let items = data.docs.map(e => withUidAndConvertedDates(e.data(),e.id))
                res(items)
            })
                .catch((err: Error) => {
                    rej(err);
                })
        })
    }

    protected override readPaginatedItemsInternal(item: T | null, paginationOptions: [ItemsPaginator, PropertySorter[] | null]): Promise<T[] | undefined> {
        return new Promise<T[] | undefined>((res, rej) => {
            if(paginationOptions[1] == null){
                throw new Error("Firestore does not accept a paginated query without any order.");
            }
            if (paginationOptions[0].previousPageLastItemUid) {
                this.collection.ref.doc(paginationOptions[0].previousPageLastItemUid).get().then(prevDoc => {
                    //TODO: make generic with a method that returns the ref with concatenated paginators.
                    this.collection.ref.orderBy(paginationOptions[1]![0].key).orderBy(paginationOptions[1]![1].key).orderBy(paginationOptions[1]![2].key, "desc").startAfter(prevDoc).limit(paginationOptions[0].numberOfItems).get()
                        .then(data => {
                            let items = data.docs.map(e => withUidAndConvertedDates(e.data(), e.id))
                            res(items)
                        })
                        .catch((err: Error) => {
                            rej(err)
                        })
                })   
            }
            else{ //first query
                this.collection.ref.orderBy(paginationOptions[1]![0].key).orderBy(paginationOptions[1]![1].key).orderBy(paginationOptions[1]![2].key, "desc").limit(paginationOptions[0].numberOfItems).get()
                .then(data=> {
                    let items = data.docs.map(e => withUidAndConvertedDates(e.data(),e.id))
                    res(items)
                })
                .catch((err: Error) => {
                    rej(err);
                })
            }
        });
    }

    protected override readFilteredItemsInternal(item: T | null, filters: [PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>): Promise<T[] | undefined> {
        return new Promise<T[] | undefined>((res,rej) => {
            let query = getFirestoreQuery(this.collection.ref, filters);
            if(query instanceof Array){
                let promises = query.map(q => q.get());
                Promise.all(promises).then(result => {
                    //distinct on querySnapshots
                    let items = result.flatMap(data => data.docs.map(e => withUidAndConvertedDates(e.data(), e.id)));
                    let map = new Map(items.map(i => [i.uid,i]))
                    let values =  [...map.values()];
                    res(values);
                })
                .catch((err: Error) => {
                    rej(err);
                })
            }
            else{
                query.get().then((data) => {
                    let items = data.docs.map(e => withUidAndConvertedDates(e.data(),e.id))
                    res(items)
                })
                .catch((err: Error) => {
                    rej(err);
                })
            }
        });
    }

    protected override readItemInternal(item: T): Promise<T | undefined> {
        if (this.transaction != null){
            return this.readItemInTransactInternal(item, this.transaction);
        }
        return new Promise<T | undefined>((res,rej) => {
            this.collection.doc(item.uid).ref.get().then(e => {
                if (e.exists && e.data()) {
                    res(withUidAndConvertedDates(e.data()!,e.id))
                }
                else {
                    res(undefined)
                }
            })
            .catch((err: Error) => {
                rej(err);
            })
        })
    }

    private readItemInTransactInternal(item: T, ref: firebase.default.firestore.Transaction ) : Promise<T| undefined> {
        return new Promise<T | undefined>((res, rej) => {
            ref.get(this.collection.doc(item.uid).ref).then(e => {
                if (e.exists && e.data()) {
                    res(withUidAndConvertedDates(e.data()!,e.id))
                }
                else {
                    res(undefined)
                }
            })
            .catch((err: Error) => {
                rej(err);
            })
        })
    }

    protected override updateItemInternal(item: T): Promise<boolean> {
        if(this.batch != null){
            return this.updateItemInBatchOrTransactInternal(item, this.batch);
        }
        else if (this.transaction != null){
            return this.updateItemInBatchOrTransactInternal(item, this.transaction);
        }
        return new Promise<boolean>((res, rej) => {
            this.collection.doc(item.uid).update(item).then(() => {
                res(true);
            })
                .catch((err: Error) => {
                    res(false);
                })
        })
    }

    private updateItemInBatchOrTransactInternal(item: T, ref:firebase.default.firestore.WriteBatch | firebase.default.firestore.Transaction ) : Promise<boolean> {
        return new Promise<boolean>((res) => {
            ref.update(this.collection.doc(item.uid).ref, item); 
            this.batchService.committed.subscribe(committed => {
                res(committed);
            })
        })
    }

    protected override deleteItemInternal(item: T): Promise<boolean> {
        if(this.batch != null){
            return this.deleteItemInBatchOrTransactInternal(item, this.batch);
        }
        else if (this.transaction != null){
            return this.deleteItemInBatchOrTransactInternal(item, this.transaction);
        }
        return new Promise<boolean>((res, rej) => {
                this.collection.doc(item.uid).delete()
                .then(() => {
                    res(true);
                })
                .catch((err: Error) => {
                    rej(err);
                })
            });
    }

    private deleteItemInBatchOrTransactInternal(item: T,ref:firebase.default.firestore.WriteBatch | firebase.default.firestore.Transaction ) : Promise<boolean> {
        return new Promise<boolean>((res) => {
            ref.delete(this.collection.doc(item.uid).ref); 
            this.batchService.committed.subscribe(committed => {
                res(committed);
            })
        })
    }


    protected override updateItemsInternal(items: T[]): Promise<boolean> {
        return new Promise<boolean>((res) => {
            let promises : Promise<boolean>[] = [];
            if(!this.batch && ! this.transaction){
                this.batchService.startWriteBatch();
                for(var item of items){
                    promises.push(this.updateItemInternal(item))
                }
                this.batchService.commitWriteBatch();
            }
            else {
                for(var item of items){
                    promises.push(this.updateItemInternal(item))
                }
            }
            Promise.all(promises).then(result => res(result.every(r => r == true)))
        })
    }

    protected override deleteItemsInternal(items: T[]): Promise<boolean> {
        return new Promise<boolean>((res) => {
            let promises : Promise<boolean>[] = [];
            if(!this.batch && ! this.transaction){
                this.batchService.startWriteBatch();
                for(var item of items){
                    promises.push(this.deleteItemInternal(item))
                }
                this.batchService.commitWriteBatch();
            }
            else {
                for(var item of items){
                    promises.push(this.deleteItemInternal(item))
                }
            }
            Promise.all(promises).then(result => res(result.every(r => r == true)))         
        })
    }

    protected override createItemsInternal(items: T[]): Promise<T[] | undefined> {
        return new Promise<T[] | undefined>((res) => {
            let promises : Promise<T | undefined>[] = [];
            if(!this.batch && ! this.transaction){
                this.batchService.startWriteBatch();
                for(var item of items){
                    promises.push(this.createItemInternal(item))
                }
                this.batchService.commitWriteBatch();
            }
            else {
                for(var item of items){
                    promises.push(this.createItemInternal(item))
                }
            }
            Promise.all(promises).then(result => {
                let elems = (result as (T | undefined)[])  
                let eelems = elems.filter(e => e != undefined) as T[]
                res(eelems)
            })
        })
    }
}
