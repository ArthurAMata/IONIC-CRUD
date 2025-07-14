import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal, IonItemSliding } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage {
  listaDisciplinas: { nomeAssunto: string; detalhes: string }[] = [];
  modalVisivel = false;
  dadosFormulario = { nomeAssunto: '', detalhes: '' };
  indiceEdicao: number | null = null;

  constructor(private gerenciadorAlerta: AlertController) {
    this.carregarInformacoes();
  }

  carregarInformacoes() {
    const dadosArmazenados = localStorage.getItem('disciplinas');
    if (dadosArmazenados) {
      this.listaDisciplinas = JSON.parse(dadosArmazenados);
    }
  }

  salvarInformacoes() {
    localStorage.setItem('disciplinas', JSON.stringify(this.listaDisciplinas));
  }

  exibirModalEdicao(disciplina?: { nomeAssunto: string; detalhes: string }, indice?: number) {
    this.indiceEdicao = indice !== undefined ? indice : null;

    if (disciplina) {
      this.dadosFormulario = { ...disciplina };
    } else {
      this.reiniciarFormulario();
    }

    this.modalVisivel = true;
  }

  ocultarModal() {
    this.modalVisivel = false;
    this.reiniciarFormulario();
  }

  reiniciarFormulario() {
    this.dadosFormulario = {
      nomeAssunto: '',
      detalhes: ''
    };
    this.indiceEdicao = null;
  }

  async salvarDisciplina() {
    if (!this.dadosFormulario.nomeAssunto.trim()) {
      await this.emitirAlerta('Campo Essencial', 'O título da disciplina não pode ser vazio.');
      return;
    }

    if (this.indiceEdicao !== null) {
      this.listaDisciplinas[this.indiceEdicao] = { ...this.dadosFormulario };
    } else {
      this.listaDisciplinas.push({ ...this.dadosFormulario });
    }

    this.salvarInformacoes();
    this.ocultarModal();
  }

  async confirmarRemocao(indice: number) {
    const avisoConfirmacao = await this.gerenciadorAlerta.create({
      header: 'Confirmação Necessária',
      message: 'Tem certeza de que deseja remover esta disciplina?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Remover',
          handler: () => {
            this.listaDisciplinas.splice(indice, 1);
            this.salvarInformacoes();
          }
        }
      ]
    });
    await avisoConfirmacao.present();
  }

  private async emitirAlerta(titulo: string, mensagem: string) {
    const alertaGeral = await this.gerenciadorAlerta.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alertaGeral.present();
  }
}