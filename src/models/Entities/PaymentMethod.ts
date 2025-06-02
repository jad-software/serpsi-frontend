export enum PaymentPossibilities{
  DINHEIRO = 'DINHEIRO',
  CARTAO = 'CARTAO',
  TRANSFERENCIA = 'TRANSFERENCIA', 
  PIX = 'PIX'
}

export interface PaymentMethod{
  paymentDate: string;
  paymentType: PaymentPossibilities;
}