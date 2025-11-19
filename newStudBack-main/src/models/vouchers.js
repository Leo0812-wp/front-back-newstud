class Coupons {
    constructor(productId, companyId, activationTimes, desactivationTime, dayOfWeek, nbUtilisation) {
      this.productId = productId;
      this.companyId = companyId;
      this.activationTime = activationTimes;
      this.desactivationTime = desactivationTime;
      this.dayOfWeek = dayOfWeek;
      this.nbUtilisation = nbUtilisation;
    }
  }
  
  module.exports = Coupons;   
  