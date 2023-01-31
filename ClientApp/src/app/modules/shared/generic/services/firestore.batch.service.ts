import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { allItemsSetKey as allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { BulkCrudService } from './bulk.crud.service';
import { getFilterFromKey, getFilterKey, isMatchingFilter } from '../filters/filters.helper';
import { CrudService } from './crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore/firestore';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class FirestoreBatchService {
    batch: firebase.default.firestore.WriteBatch | null = null;
    transaction: firebase.default.firestore.Transaction | null = null;
    globalBatchRef : BehaviorSubject<firebase.default.firestore.WriteBatch | null>; 
    globalTransactionRef : BehaviorSubject<firebase.default.firestore.Transaction | null>; 
    committed : Subject<boolean>;


    //when a batch is created from a parent operation, this operation will start a transact or a batch. 
    //if the inside operation starts againa nother transact, means that the same operation wll commit the transact. 
    //so if an existing transact makes the startTransaction idempotente, the commit will be skipped and it will be just the last one (parent operation) 
    batchCommitToSkip = 0;
    transactionCommitToSkip = 0;

    constructor(private firestore: AngularFirestore) { 
       this.globalBatchRef = new BehaviorSubject<firebase.default.firestore.WriteBatch | null>(null)
       this.globalTransactionRef = new BehaviorSubject<firebase.default.firestore.Transaction | null>(null)
       this.committed = new Subject<boolean>();
    } 

    public startWriteBatch(){//idempotente
        if(!this.batch){
            this.batch = this.firestore.firestore.batch();
            this.globalBatchRef.next(this.batch);
            this.globalTransactionRef.next(null);
        }
        else{
            this.batchCommitToSkip ++;
        }  
    }

    public startTransaction(): Promise<firebase.default.firestore.Transaction | null>{ //idempotente
        let subject = new Subject<firebase.default.firestore.Transaction | null>();
        if(!this.transaction){
            this.firestore.firestore.runTransaction((transact) => {
                this.transaction = transact;
                this.globalTransactionRef.next(transact);
                this.globalBatchRef.next(null);
                subject.next(transact);
                return firstValueFrom(this.committed);
            })
        }
        else{
            this.transactionCommitToSkip ++;
        }
        return firstValueFrom(subject)
    }

    public commitWriteBatch(){
        if(this.batchCommitToSkip > 0){
            this.batchCommitToSkip--;
            return;
        }
            
        if(this.batch){
            this.batch.commit().then( () => {
                this.globalBatchRef.next(null);
                this.committed.next(true);
            })
        }
        else throw new Error("Cannot commit a not started writeBatch");
    }

    public commitTransaction(){
        if(this.transactionCommitToSkip > 0){
            this.transactionCommitToSkip--;
            return;
        }

        if(this.transaction){
            this.globalTransactionRef.next(null);
            this.committed.next(true);
        }
        else throw new Error("Cannot commit a not started transaction");
    }
}
