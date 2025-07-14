import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-materia',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editando ? 'Editar' : 'Nova' }} Matéria</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="form.nome"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Anotações</ion-label>
        <ion-textarea [(ngModel)]="form.anotacoes"></ion-textarea>
      </ion-item>

      <ion-button expand="block" color="primary" (click)="salvar()">Salvar</ion-button>
    </ion-content>
  `
})
export class ModalMateriaComponent {
  @Input() form = { nome: '', anotacoes: '' };
  @Input() editando = false;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  salvar() {
    this.modalCtrl.dismiss(this.form);
  }
}

