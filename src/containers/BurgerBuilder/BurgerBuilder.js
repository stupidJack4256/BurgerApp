import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
		salad : 39.25,
		bacon : 49.99,
		cheese: 44.50,
		meat : 59.49
	};

class BurgerBuilder extends Component {
	
	state = {
		ingredients : null,
		totalPrice : 100,
		purchasable: false,
		purchasing : false,
		loading : false,
		error: false
	}

	componentDidMount (){
		axios.get('https://react-burger-app-98849.firebaseio.com/ingredients.json')
		.then(response =>{
			this.setState({ingredients: response.data})
		})
		.catch(error=>{
			this.setState({error: true})
		})
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
		// alert("Continue!")
		
		const queryParams = [];
		for(let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('price=' + this.state.totalPrice)
		const queryString = queryParams.join('&');
		
		this.props.history.push({
			pathname : '/checkout',
			search : '?' + queryString
		});
	}
	
	render() {
		
		const disabledInfo = {
			...this.state.ingredients
		}
		for( let key in disabledInfo){
			disabledInfo[key]=disabledInfo[key] <= 0;
		}
		
		let orderSummary = null;
		
		let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
		
		if(this.state.ingredients){
			 burger = (
					<Aux>
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
			 );
			
			 orderSummary = <OrderSummary 
						price={this.state.totalPrice.toFixed(2)}
						ingredients={this.state.ingredients}
						purchaseCancelled={this.purchaseCancelHandler}
						purchaseContinued={this.purchaseContinueHandler}
						/>
		}
		if(this.state.loading){
			orderSummary= <Spinner />;
		}
		
		
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		)
	}	
	
}

export default withErrorHandler(BurgerBuilder, axios);