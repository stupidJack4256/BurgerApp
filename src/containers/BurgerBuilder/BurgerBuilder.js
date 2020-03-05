import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';


const INGREDIENT_PRICES = {
		salad : 39.25,
		bacon : 49.99,
		cheese: 44.50,
		meat : 59.49
	};

class BurgerBuilder extends Component {
	
	state = {
		ingredients : {
			salad: 0,
			bacon :0,
			cheese : 0,
			meat : 0
		},
		totalPrice : 100,
		purchasable: false,
		purchasing : false
	}

	updatePurchaseState =(ingredients)=> {
		
		const sum = Object.keys(ingredients)
					.map(igKey=>{
						return ingredients[igKey]
					})
		// or Object.values(ingredients).reduce(....)  this can be used
					.reduce((sum, el)=>{
						return sum +el ;
					},0);
		this.setState({purchasable: sum > 0})
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice + priceAddition;
		
		this.setState({totalPrice:updatedPrice, ingredients:updatedIngredients});
		this.updatePurchaseState(updatedIngredients)
	}
	
	removeIngredientHandler=(type) =>{
		const oldCount = this.state.ingredients[type];
		if(oldCount <= 0){
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice - priceDeduction;
		
		this.setState({totalPrice:updatedPrice, ingredients:updatedIngredients});
		this.updatePurchaseState(updatedIngredients)
	}
	
	purchaseHandler=()=>{
		this.setState({purchasing: true})
	}
	purchaseCancelHandler=()=>{
		this.setState({purchasing:false})
	}
	purchaseContinueHandler=()=>{
		alert("Continue!")
	}
	
	render() {
		
		const disabledInfo = {
			...this.state.ingredients
		}
		for( let key in disabledInfo){
			disabledInfo[key]=disabledInfo[key] <= 0;
		}
		
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					<OrderSummary 
						ingredients={this.state.ingredients}
						purchaseCancelled={this.purchaseCancelHandler}
						purchaseContinued={this.purchaseContinueHandler}
						/>
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls 
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					price={this.state.totalPrice}
					purchasable={this.state.purchasable}
					ordered={this.purchaseHandler}
					/>
			</Aux>
		)
	}	
	
}

export default BurgerBuilder;