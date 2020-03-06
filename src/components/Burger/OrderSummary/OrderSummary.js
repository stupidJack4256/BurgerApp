import React, {Component} from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
	
	//this component could be function component.. does't have to be a class component.
	
	componentDidUpdate(){
		console.log('[OrderSummary] will update');
	}
	
	render(){
		const ingredientSummary = Object.keys(this.props.ingredients)
				.map(igKey=>{
					return <li key={igKey} >
								<span style={{textTransform : 'capitalize'}} >                                                                    {igKey}</span> : {this.props.ingredients[igKey]} 
							</li>
						})
		
		return(
			<Aux>
			<h3>Your Order</h3>
			<p>A Delicious Burger with the following ingredients:</p>
			<ul>
				{ingredientSummary}
			</ul>
			<p><strong>Total Price: {this.props.price}</strong></p>
			<Button btnType="Success" clicked={this.props.purchaseContinued} >CONTINUE</Button>
			<Button btnType="Danger" clicked={this.props.purchaseCancelled} >CANCEL</Button>
		</Aux>
		)
	}
} 

export default OrderSummary;