export interface Product {
  id: string;
  data: {
    name: string;
    description: string;
    priceInit?: string;
    priceFinal?: string;
    promotion?: string;
    category?: string;
    companyId: string;
    usable?: number;
    urlImageCompanyPage?: string;
    urlImageProductPage?: string[];
    dateCreate?: Date;
  };
}

export interface Company {
  id: string;
  data: {
    name: string;
    description: string;
    place?: string;
    category?: string;
    urlImage?: string;
    dateArrival?: Date;
  };
}

export interface Voucher {
  id: string;
  productId: string;
  companyId: string;
  activationTime: string;
  desactivationTime: string;
  dayOfWeek: string;
  voucher1?: string;
  voucher2?: string;
  voucher3?: string;
  [key: string]: any;
}

export interface UpdateVoucherData {
  productId: string;
  companyId: string;
  activationTime: string;
  desactivationTime: string;
  dayOfWeek: string;
}

export interface CreateVoucherData {
  productId: string;
  companyId: string;
  activationTime: string;
  desactivationTime: string;
  dayOfWeek: string;
  nbUtilisation: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  companyId: string;
  usable?: number;
  priceInit?: string;
  priceFinal?: string;
  promotion?: string;
  urlImageCompanyPage?: string;
  urlImageProductPage?: string[];
}

export interface CreateCompanyData {
  name: string;
  description: string;
  category: string;
  place: string;
  urlImage?: string;
}

export interface User {
  id: string;
  data: {
    uid?: string;
    name?: string;
    firstName?: string;
    username?: string;
    favorites?: string[];
    vouchersUsed?: string[];
    [key: string]: any;
  };
}

