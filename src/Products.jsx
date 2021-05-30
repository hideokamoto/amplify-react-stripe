import { useEffect, useState } from 'react';
import {API} from 'aws-amplify'

export function Products() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    API.get('stripeapi', '/products')
      .then(data => {
        setProducts(data)
      })
      .catch(e => {
        console.error(e)
      })
  }, [])
  return (
      <pre><code>{JSON.stringify(products,null,2)}</code></pre>
  );
}