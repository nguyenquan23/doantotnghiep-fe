/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefundInvoice } from 'src/types/invoice.type'
import http from 'src/utils/http'
import { PaymentParams } from './../types/payment-params.type'
import { CryptoPaymentData } from './../types/payment.type'
import { SuccessResponse } from './../types/utils.type'

export const URL_PAYMENT = 'payment'
export const URL_CRYPTO = 'etherscan'

const paymentApi = {
  getPaymentUrl(params: PaymentParams) {
    return http.get<SuccessResponse<string>>(`${URL_PAYMENT}/pay`, { params })
  },
  refundInvoice(params: { invoice_id: number }) {
    return http.get<SuccessResponse<RefundInvoice>>(`${URL_PAYMENT}/refund`, { params })
  },
  transferMoney(price: number) {
    return http.get<SuccessResponse<number>>(`${URL_PAYMENT}/amount/${price}`)
  },
  cryptoTransaction(body: CryptoPaymentData) {
    return http.post<SuccessResponse<{ status: number; invoiceId: number }>>(`${URL_PAYMENT}/transaction`, body)
  },
  transferDollarToEth(params: { totalPrice: number }) {
    return http.get<SuccessResponse<number>>(`${URL_CRYPTO}/get-eth-price`, { params })
  },
  makeInvoiceByMetamask(body: any) {
    return http.post<SuccessResponse<{ status: number; invoiceId: number }>>(`${URL_CRYPTO}/make-invoice`, body)
  }
}

export default paymentApi
