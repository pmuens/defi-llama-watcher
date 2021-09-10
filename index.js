const fs = require('fs-extra')
const fetch = require('node-fetch')

async function main() {
  console.log('Fetching DeFi Llama data...')

  const result = await fetch('https://api.llama.fi/protocols')
    .then(res => res.json())

  const data = result.map((item) => {
    let chain = 'N/A'
    let category = 'N/A'
    const { id, name, url } = item
    if (item.chain) chain = item.chain
    if (item.chains && item.chains.length) chain = item.chains.sort().join(' | ')
    if (item.category) category = item.category
    return { id, name, category, chain, url }
  })

  const sorted = data.sort((a, b) => {
    const parsedA = parseFloat(a.id)
    const parsedB = parseFloat(b.id)
    if (parsedA < parsedB) return 1
    if (parsedA > parsedB) return -1
    return 0
  })
  
  const csv = sorted.reduce((accum, item) => {
    const { id, name, category, chain, url } = item
    return [...accum, [id, name, category, chain, url]]
  }, [['ID', 'Name', 'Category', 'Chain(s)', 'URL']]).join('\n')

  await fs.writeFile('./data.csv', csv, 'utf8')

  console.log('Done...')
}

main()
