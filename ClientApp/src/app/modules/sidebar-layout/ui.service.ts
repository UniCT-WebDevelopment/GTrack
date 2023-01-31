import { MediaMatcher } from "@angular/cdk/layout"
import { Injectable } from "@angular/core"
import { StorageMap } from "@ngx-pwa/local-storage"
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs"
import { take } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})

export class UIService {

    mobileQuery!: MediaQueryList;
    private _mobileQueryListener!: (() => void);

    private _mobile: BehaviorSubject<boolean>
    private _sideNavOpen: BehaviorSubject<boolean>
    private _darkMode: ReplaySubject<boolean> = new ReplaySubject()


    constructor(
        private storage: StorageMap,
        private media: MediaMatcher,
    ) {
        this._mobile = new BehaviorSubject(false as boolean)
        this._sideNavOpen = new BehaviorSubject(true as boolean)

        this.getDarkMode()
        this.startMobileDetection()
        //this.checkAppVersion()
    }

    get mobile$(): Observable<boolean> {
        return this._mobile.asObservable().pipe()
    }

    get sideNavOpen$(): Observable<boolean> {
        return this._sideNavOpen.asObservable().pipe()
    }

    get darkMode$(): Observable<boolean> {
        return this._darkMode.asObservable().pipe()
    }

    getDarkMode(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.storage.get('dark').pipe(take(1)).subscribe((v: any) => {

                this._darkMode.next(!!v)
                resolve(true)
            })
        })
    }

    private startMobileDetection() {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)')
        this.setMobile(this.mobileQuery.matches)
        this._mobileQueryListener = () => {
            this.setMobile(this.mobileQuery.matches)
        }
        this.mobileQuery.addListener(this._mobileQueryListener)
    }

    // private checkAppVersion() {
    //     this.storage.get('version').subscribe((v: any) => {
    //         if (!v || v < this.cns.getAppVersionCode()) this.showNewVersionDialog()
    //     })
    // }

    // private saveAppVersion() {
    //     this.storage.set('version', this.cns.getAppVersionCode()).subscribe(() => { })
    // }

    // private showNewVersionDialog() {
    //     this.saveAppVersion()
    //     //this.dialog.open(NewAppVersionDialogComponent, { maxWidth: "300px" });
    // }

    setMobile(v: boolean) {
        this._mobile.next(v)
    }

    setSideNavOpen(v: boolean) {
        this._sideNavOpen.next(v)
    }

    setDarkMode(v: boolean) {
        this._darkMode.next(v)
        this.storage.set('dark', v).subscribe(() => { })
    }
}