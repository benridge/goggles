module.exports = {
  getAmountCategory: function(amount, duration) {
    var divisor, timeAdjustedAmount;

    if (!amount || !duration || amount === 0) {
      return "none";
    }

    divisor = duration/24;
    timeAdjustedAmount = amount/divisor;

    if (timeAdjustedAmount < 6) {
      return "small";
    }
    if (timeAdjustedAmount >= 6 && timeAdjustedAmount < 12) {
      return "medium";
    }
    if (timeAdjustedAmount >= 12 && timeAdjustedAmount < 18) {
      return "large";
    }
    return "xlarge";
  }
};