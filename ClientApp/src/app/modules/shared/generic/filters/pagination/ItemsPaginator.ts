export class ItemsPaginator{
    numberOfItems: number
    previousPageLastItemUid: string | null

    constructor(numberOfItems:number, lastItemUid: string|null = null){
        this.numberOfItems = numberOfItems;
        this.previousPageLastItemUid = lastItemUid;
    }
}