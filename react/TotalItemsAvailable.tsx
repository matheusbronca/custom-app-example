import React, { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
import axios from 'axios'

// import { useCssHandles } from 'vtex.css-handles'
// import styles from './styles/totalItemsAvailable.module.css'

function TotalItemsAvailable({
  shouldRender = true,
  message = 'Available items:',
  fontColor = '#000',
  fontSize = '18px',
}) {
  const productContext = useProduct()
  const [selectedSKU, setSelectedSKU] = useState<number | string | null>(null)
  const [availableItems, setAvailableItems] = useState<number | string | null>(
    null
  )

  useEffect(() => {
    if (!productContext) return
    const itemId = productContext.selectedItem?.itemId

    if (!itemId) return
    setSelectedSKU(itemId)
  }, [productContext])

  const url = `/_v/total-items-available/${selectedSKU}`

  axios.get(url).then((response) => setAvailableItems(response.data))

  if (!shouldRender) return null

  return (
    <div style={{ color: fontColor, fontSize: `${fontSize}px` }}>
      {message}: {availableItems} units
    </div>
  )
}

TotalItemsAvailable.schema = {
  title: 'Total Items Available',
  description:
    'An app who renders a customized message containing the total amount of a product in stock.',
  type: 'object',
  properties: {
    shouldRender: {
      title: 'Visibility',
      description: 'Should this component be render?',
      type: 'boolean',
    },
    message: {
      title: 'Message',
      description: 'A Message to be printed',
      type: 'string',
    },
    fontColor: {
      title: 'Font color',
      description: 'The desired font color value, in hexadecimal',
      type: 'string',
    },
    fontSize: {
      title: 'Font Size',
      description: 'The desired font size value, in pixels unit',
      type: 'number',
    },
  },
}

export default TotalItemsAvailable
