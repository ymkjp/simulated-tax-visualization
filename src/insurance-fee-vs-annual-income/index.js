
/**
 * Calculate after-tax insurance fee per month as at 2018
 * @see https://codepen.io/ymkjp/pen/bPygPa
 * @param {Number} mInsuranceFee Monthly insurance fee
 * @param {Number} yTaxableIncome Annual taxable income
 */
const calcAfterTaxInsuranceFeePerMonth = (mInsuranceFee, yTaxableIncome) => {
  const yiFee = 12 * mInsuranceFee
  const itExemption = calcIncomeTaxExemption(yiFee)
  const rtExemption = calcResidentialTaxExemption(yiFee)
  const itRate = getIncomeTaxRate(yTaxableIncome - itExemption)
  const rtRate = getResidentialTaxRate(yTaxableIncome - rtExemption)
  return (yiFee - (itExemption * itRate) - (rtExemption * rtRate)) / 12
}

/**
 * Return tax rate
 * @see https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 * @param yTaxableIncome
 * @returns {number}
 */
const getIncomeTaxRate = (yTaxableIncome) => {
  if (yTaxableIncome < 1950000) {
    return 0.05
  } else if (yTaxableIncome < 3300000) {
    return 0.10
  } else if (yTaxableIncome < 6950000) {
    return 0.20
  } else if (yTaxableIncome < 9000000) {
    return 0.23
  } else if (yTaxableIncome < 18000000) {
    return 0.33
  } else if (yTaxableIncome < 40000000) {
    return 0.40
  } else {
    return 0.45
  }
}

/**
 * Return tax rate
 * @see https://ja.wikipedia.org/wiki/%E5%B8%82%E7%94%BA%E6%9D%91%E6%B0%91%E7%A8%8E
 * @param yTaxableIncome
 * @returns {number}
 */
const getResidentialTaxRate = (yTaxableIncome) => {
  return 0.1
}

/**
 * Return exemption amount
 * @see https://www.jili.or.jp/knows_learns/basic/tax/premium.html
 * @param yiFee
 * @returns {number}
 */
const calcIncomeTaxExemption = (yiFee) => {
  if (yiFee <= 20000) {
    return yiFee
  } else if (yiFee <= 40000) {
    return 0.5 * yiFee + 10000
  } else if (yiFee <= 80000) {
    return 0.25 * yiFee + 20000
  } else {
    return 40000
  }
}

/**
 * Return exemption amount
 * @see https://www.jili.or.jp/knows_learns/basic/tax/premium.html
 * @param yiFee
 * @returns {number}
 */
const calcResidentialTaxExemption = (yiFee) => {
  if (yiFee <= 12000) {
    return yiFee
  } else if (yiFee <= 32000) {
    return 0.5 * yiFee + 6000
  } else if (yiFee <= 56000) {
    return 0.25 * yiFee + 14000
  } else {
    return 28000
  }
}

numeral.register('locale', 'jp', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  currency: {
    symbol: '¥'
  }
})

const createData = () => {
  const monthlyInsuranceFeeTable = Array.from({length: 7}, (_, i) => {
    return (i + 1) * 1000
  })

  const annualTaxableIncomeTable = Array.from({length: 202}, (_, i) => {
    return i * 100 * 1000
  })

  const colors = palette('tol-dv', monthlyInsuranceFeeTable.length).map((hex) => {
    return '#' + hex
  })
  const datasets = monthlyInsuranceFeeTable.map((x1, i) => {
    return {
      label: `${numeral(x1).format('$0,0')} per month`,
      borderWidth: 2,
      showLine: true,
      backgroundColor: colors[i] + '11',
      borderColor: colors[i],
      data: annualTaxableIncomeTable.map(x2 => {
        return calcAfterTaxInsuranceFeePerMonth(x1, x2)
      })
    }
  })
  return {
    labels: annualTaxableIncomeTable.map(v => numeral(v).format('$0,0')),
    datasets: datasets
  }
}

const options = {
  title: {
    display: true,
    text: 'Tax Exemption - insurance fee vs annual income (JPY)'
  },
  scales: {
    yAxes: [{
      ticks: {
        callback: (v) => {
          return numeral(v).format('$0,0')
        }
      }
    }]
  }
}

if (typeof require === 'undefined' || require.main === module) {
  numeral.locale('jp')
  Chart.Line('chart', {
    options: options,
    data: createData()
  })
}
