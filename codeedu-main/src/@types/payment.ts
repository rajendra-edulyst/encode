export interface PaymentCreateRequest {
    gateway: string
    amount: string | number
    firstname: string
    email: string
    phone: string
    productinfo: string
    surl?: string
    furl?: string
}

export interface PaymentVerifyRequest {
    gateway: string
    mihpayid: string
    mode?: string
    status?: string
    unmappedstatus?: string
    key?: string
    txnid?: string
    amount: string | number
    cardCategory?: string
    discount?: string | number
    net_amount_debit?: string | number
    addedon?: string
    productinfo?: string
    firstname?: string
    lastname?: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    country?: string
    zipcode?: string
    email?: string
    phone?: string
    hash?: string
    payment_source?: string
    PG_TYPE?: string
    bank_ref_num?: string
    cardnum?: string
    payment?: string
    Name?: string
    Email?: string
    Address?: string
    description?: string
    Quantity?: string | number
    Price?: string | number
    pro_course?: string
    pro_course_id?: string
    purchase_type?: string
    sub_total?: string | number
    tax?: string | number
    total_amt?: string | number
    payment_method?: string
    txn_id?: string
    payment_status?: string
    paid_date?: string
    [key: string]: any
}

export interface PaymentCreateResponse {
    status: number
    message?: string
    gateway?: string
    data: {
        txnid: string
        hash: string
        url: string
        key: string
        salt?: string
        amount: string | number
        firstname: string
        email: string
        phone?: string
        product_info?: string
        productinfo?: string
        surl?: string
        furl?: string
    }
}

export interface PaymentVerifyResponse {
    status: boolean | number | string
    message?: string
    payment_status?: string
    invoice_no?: string
    data?: any
}
