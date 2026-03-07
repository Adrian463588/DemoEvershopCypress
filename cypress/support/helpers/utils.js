export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const extractPrice = (priceString) => {
  return parseFloat(priceString.replace(/[^0-9.-]+/g, ''))
}
