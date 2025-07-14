import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal, IonItemSliding } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-homepage', // Mantido para consistência com o template
  templateUrl: './homepage.page.html', // Mantido para consistência com o template
  styleUrls: ['./homepage.page.scss'], // Mantido para consistência com o template
})
export class HomepagePage {
  // Dados das disciplinas
  listaDisciplinas: { nomeAssunto: string; detalhes: string }[] = [];
  
  // Controle de visibilidade do modal
  modalVisivel = false;
  
  // Objeto para formulário de entrada
  dadosFormulario = { nomeAssunto: '', detalhes: '' };
  
  // Índice da disciplina em edição (null para nova disciplina)
  indiceEdicao: number | null = null;

  constructor(private gerenciadorAlerta: AlertController) {
    // Carrega informações persistentes ao iniciar o componente
    this.carregarInformacoes();
  }

  /**
   * Carrega informações das disciplinas do armazenamento local.
   */
  carregarInformacoes() {
    const dadosArmazenados = localStorage.getItem('disciplinas'); // Chave alterada
    if (dadosArmazenados) {
      this.listaDisciplinas = JSON.parse(dadosArmazenados);
    }
  }

  /**
   * Salva as informações atuais das disciplinas no armazenamento local.
   */
  salvarInformacoes() {
    localStorage.setItem('disciplinas', JSON.stringify(this.listaDisciplinas)); // Chave alterada
  }

  /**
   * Abre o modal para adição ou edição de disciplina.
   * @param disciplina Item da disciplina a ser editado (opcional).
   * @param indice Índice da disciplina na lista (opcional).
   */
  exibirModalEdicao(disciplina?: { nomeAssunto: string; detalhes: string }, indice?: number) {
    this.indiceEdicao = indice !== undefined ? indice : null;
    
    if (disciplina) {
      this.dadosFormulario = { ...disciplina }; // Copia os dados para edição
    } else {
      this.reiniciarFormulario(); // Limpa o formulário para nova entrada
    }
    
    this.modalVisivel = true;
  }

  /**
   * Fecha o modal e redefine o formulário.
   */
  ocultarModal() {
    this.modalVisivel = false;
    this.reiniciarFormulario();
  }

  /**
   * Redefine o formulário para os valores iniciais.
   */
  reiniciarFormulario() {
    this.dadosFormulario = {
      nomeAssunto: '',
      detalhes: ''
    };
    this.indiceEdicao = null;
  }

  /**
   * Salva uma nova disciplina ou atualiza uma existente.
   */
  async salvarDisciplina() {
    if (!this.dadosFormulario.nomeAssunto.trim()) {
      await this.emitirAlerta('Campo Essencial', 'O título da disciplina não pode ser vazio.');
      return;
    }

    if (this.indiceEdicao !== null) {
      // Caso de edição: atualiza a disciplina existente
      this.listaDisciplinas[this.indiceEdicao] = { ...this.dadosFormulario };
    } else {
      // Caso de adição: adiciona uma nova disciplina
      this.listaDisciplinas.push({ ...this.dadosFormulario });
    }

    this.salvarInformacoes();
    this.ocultarModal();
  }

  /**
   * Confirma a remoção de uma disciplina.
   * @param indice O índice da disciplina a ser removida.
   */
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
            this.listaDisciplinas.splice(indice, 1); // Remove do array
            this.salvarInformacoes(); // Salva a alteração
          }
        }
      ]
    });
    await avisoConfirmacao.present();
  }

  /**
   * Exibe um alerta genérico ao usuário.
   * @param titulo O título do alerta.
   * @param mensagem A mensagem a ser exibida no alerta.
   */
  private async emitirAlerta(titulo: string, mensagem: string) {
    const alertaGeral = await this.gerenciadorAlerta.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alertaGeral.present();
  }
}