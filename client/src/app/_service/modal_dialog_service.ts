/*
 * **************************************************************
 * File: modal_dialog_service.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 10th May 2021 6:43:12 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:08 am
 * Modified By: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Copyright 2020 - 2021 @thkl / github.com/thkl
 * -----
 * **************************************************************
 * MIT License
 * 
 * Copyright (c) 2021 github.com/thkl
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * **************************************************************
 * 
 * 
 */

import { Injectable, Type } from '@angular/core';
import {
    NgbModal,
    NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogConfirmComponent } from '../_components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogInputComponent } from '../_components/dialogs/dialog-input/dialog-input.component';
import { DialogMessageComponent } from '../_components/dialogs/dialog-message/dialog-message.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(private ngbModal: NgbModal) { }

    confirm(
        dialogTitle = 'Confirm',
        dialogClass = 'danger',
        dialogMessage = 'Really?'
    ): Observable<boolean> {
        return this.custom<DialogConfirmComponent, boolean>(
            DialogConfirmComponent, { dialogTitle, dialogClass, dialogMessage });
    }

    input(
        dialogTitle = 'Input',
        dialogClass: 'info',
        dialogMessage: string,
        initialValue: string,
    ): Observable<string> {
        return this.custom<DialogInputComponent, string>(
            DialogInputComponent, { dialogTitle, dialogClass, initialValue, dialogMessage });
    }

    message(
        dialogTitle = 'Message',
        dialogMessage: string
    ): Observable<boolean> {
        return this.custom<DialogMessageComponent, boolean>(
            DialogMessageComponent, { dialogTitle, dialogMessage });
    }

    custom<T, R>(
        content: Type<T>,
        config?: Partial<T>,
        options?: NgbModalOptions
    ): Observable<R> {
        // we use a static backdrop by default,
        // but allow the user to set anything in the options
        const modal = this.ngbModal.open(
            content,
            { backdrop: 'static', ...options }
        );

        // copy the config values (if any) into the component
        if (modal.componentInstance) {
            Object.assign(modal.componentInstance, config);
        }
        return from(modal.result).pipe(
            catchError(error => {
                console.warn(error);
                return of(undefined);
            })
        );
    }
}