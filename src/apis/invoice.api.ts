import { Invoice } from 'src/types/invoice.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_INVOICES = 'invoices'

const invoiceApi = {
  getInvoice(id: string) {
    return http.get<SuccessResponse<Invoice>>(`${URL_INVOICES}/${id}`)
  },
  getInvoices() {
    return http.get<SuccessResponse<Invoice[]>>(`${URL_INVOICES}`)
  }
}

export default invoiceApi
