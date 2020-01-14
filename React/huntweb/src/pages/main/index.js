import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

export default class Main extends Component {
    state = {
        products: [],
        productInfo: {},
        page: 1,
    }

    loadProducts =  async (page = 1) => {
        const response = await api.get(`/products?page=${page}`);
        const { docs, ...productInfo} = response.data;
        
        this.setState({ products: docs, productInfo, page }); //coloca os produtos na variavel products dentro do state
    };
    
    componentDidMount(){ //metodo executado assim que o componente for mostrado em tela
        this.loadProducts();
    }

    prevPage = () => {
        const { page } = this.state;

        if (page === 1) return;

        const pageNumber = page - 1;

        this.loadProducts(pageNumber)
    }

    nextPage = () => {
        const { page, productInfo } = this.state;

        if (page === productInfo.pages) return;

        const pageNumber = page + 1;

        this.loadProducts(pageNumber)
    }

    render(){
         const { products, page, productInfo} = this.state;

        return (
            <div className="product-list"> 
                {products.map(product => { //coloca na tela os nomes dos produtos pegando dentro da varivael prodcuts dentro do state
                    return (
                        <article key={product._id}>
                            <strong>{product.title}</strong>
                            <p>{product.description}</p>

                            <Link to={`/products/${product._id}`}>Acessar</Link>
                        </article>
                    );
                })}
                <div className="actions">
                    <button disable={page === 1} onClick={this.prevPage}>Anterior</button>
                    <button disable={page === productInfo.pages} onClick={this.nextPage}>Proximo</button>
                </div>
            </div>
        );
    }
}