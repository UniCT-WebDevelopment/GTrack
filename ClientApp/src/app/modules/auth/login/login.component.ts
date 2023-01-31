import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAuthService } from '../auth.service.api';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loading: boolean = true

	form = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", Validators.required)
	})

	constructor(
		public router: Router, 
		private auth: ApiAuthService,
		
	) { }

	ngOnInit(): void {
	}

	login() {
		this.loading = true;
		var email = this.form.value['email'];
		var password = this.form.value['password'];
		if(email && password)
			this.auth.login(email, password).then(user => {
				this.router.navigateByUrl('/');
			});
		else
			console.log("insert data")
	}

	logout() {
		this.auth.logout().then(_ => {
			this.router.navigateByUrl('/');
		})
	}
}
