import { useEffect, useState } from 'react';
import {API} from 'aws-amplify'
import { Card,  CardBody, CardTitle, CardText, Row, Col, Table, Badge, CardImg } from 'reactstrap';
import { BuyButton } from './BuyButton';

/**
 * 商品価格表 
 */
export function ProductPrice({product}) {
    if (!product.prices || product.prices.length < 1) {
        return <p>No price available</p>
    }
    return (
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>
            {product.prices
              .map(price => {
                /**
                 * Stripe Checkoutが未対応の商品タイプを除外する
                 */
                if ( price.transform_quantity ) return null;
                if ( price.tiers_mode !== null ) return null;
                return (
                    <tr key={price.id}>
                        <td>{price.nickname}</td>
                        <td>
                            {Number(price.unit_amount).toLocaleString()} {price.currency.toLocaleUpperCase()}
                            {price.recurring ? (
                            <>
                                {` / per ${price.recurring.interval_count} ${price.recurring.interval}`}
                                {price.recurring.aggregate_usage === 'sum' ? <Badge color="danger" style={{marginLeft: '0.5rem'}}>従量課金</Badge> : null}
                            </>
                            ): null}
                        </td>
                        <td><BuyButton price={price} /></td>
                    </tr>
                )
              })}
          </tbody>
        </Table>
    )
}
/**
 * サムネイル画像 
 */
export function ProductThumbnail({product}) {
    const thumbnail = product && product.images ? product.images[0]: null
    if (!thumbnail) return null;
    return (
        <Col>
          <CardImg top width="100%" src={thumbnail} alt={product.caption} />
        </Col>
    )
}

/**
 * 商品メタ情報 
 */
export function ProductMetadata({product}) {
    if (!product.metadata) return null;
    return (
        <>
          {Object.entries(product.metadata).map(([key, value]) => (
            <dl key={`${product.id}-${key}`}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </dl>
          ))}
        </>
    )
}

/**
 * 商品概要
 */
export function Product({product}) {
    return (
      <Card style={{marginBottom: "2rem"}}>
        <CardBody>
          <Row style={{marginBottom: "2rem"}}>
            <Col>
              <CardTitle tag="h1">{product.name}</CardTitle>
              <CardText>{product.description}</CardText>
              <ProductMetadata product={product} />
            </Col>
            <ProductThumbnail product={product} />
          </Row>
            <Row>
                <Col>
                    <ProductPrice product={product} />
                </Col>
            </Row>
        </CardBody>
      </Card>
    )

}

/**
 * 商品一覧
 * @returns 
 */
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
    <Row md="2">
        {products.map(product => (
          <Col key={product.id}>
              <Product product={product} />
          </Col>
         ))
        }
    </Row>
  );
}