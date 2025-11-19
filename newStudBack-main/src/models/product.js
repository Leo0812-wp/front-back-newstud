class Product {
    constructor(priceInit, priceFinal, promotion, name, category, description, companyId, usable, urlImageCompanyPage, urlImageProductPage) {
      this.priceInit = priceInit;
      this.priceFinal = priceFinal;
      this.promotion = promotion;
      this.name = name;
      this.category = category;
      this.description = description;
      this.companyId = companyId;
      this.dateCreate = new Date();
      this.usable = usable;
      this.urlImageCompanyPage = urlImageCompanyPage;
      this.urlImageProductPage = Array.isArray(urlImageProductPage) ? urlImageProductPage : [];
    }
  }
  
  module.exports = Product;   
  