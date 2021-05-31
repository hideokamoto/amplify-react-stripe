import { API, Auth } from 'aws-amplify'
import { Button, Form } from 'reactstrap';
import {loadStripe} from '@stripe/stripe-js';


const redirectToStripeCheckout = async (priceId, type) => {
    const checkout = await API.post('stripeapi', `/products/${priceId}/checkout`, {
        body: {
            type
        }
    })
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    const result = await stripe.redirectToCheckout({ sessionId: checkout.session.id })
    if (result.error) throw new Error(result.error.message)


    return;
}

export function BuyButton({price}) {
    const handleSubmit = (event) => {
        event.preventDefault()
        redirectToStripeCheckout(price.id, price.type)
            .catch(e => {
                console.log(e)
            })
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Button type="submit">Buy</Button>
        </Form>
    )
}