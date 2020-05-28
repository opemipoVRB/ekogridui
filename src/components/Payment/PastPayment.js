import React, { Component } from 'react'
import {Table} from "reactstrap";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import ReactPaginate from 'react-paginate';
import './Pagination.css'






class PastPayment extends Component {
   constructor(props) {
      super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
      this.state = {
          offset: 0,
          transactions: [],
          token:Cookies.get('token'),
          perPage: 5,
          currentPage: 0,
      };
       this.handlePageClick = this.handlePageClick.bind(this);
   }

   componentDidMount() {
     this.getPastPayment();
   }




    formatDate = (date) => {
       date = new Date(date);
       let year = date.getFullYear();
       let month = date.getMonth()+1;
       let dt = date.getDate();
       if (dt < 10) {
           dt = '0' + dt;
       }
       if (month < 10) {
           month = '0' + month;
       }
       return year+'-' + month + '-'+dt;



    };


     getPastPayment=()=> {
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'get',
                url: API_BASE_URL +'gridtracker/api/view/transactions',
                withCredentials: true

            })
            .then((response) => {
                if (response.status === 200){
                    const transactions = response.data.results;
                    const slice = transactions.slice(this.state.offset, this.state.offset + this.state.perPage);
                    const transactionData = slice.map(( transaction) =>
                        <React.Fragment>
                            <tr>
                                <td>{transaction.id}</td>
                                <td>{ this.formatDate(transaction.date)}</td>
                                {/*<td>{ transaction.date}</td>*/}
                                <td>{ (transaction.description === 2)? "Customer Payment" : "Usage Invoice"}</td>
                                <td>{transaction.reference}</td>
                                <td>₦{transaction.payment}</td>
                                <td className="text-center">{transaction.units_purchased} Kwh</td>
                            </tr>
                    </React.Fragment>);

                    this.setState({
                        pageCount: Math.ceil(transactions.length/ this.state.perPage),
                        transactions: transactionData
                    });



                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


    };

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.getPastPayment()
        });

    };





   getPaymentTable(){
      return this.state.transactions.map((transaction,  index) => {
          const {id, date, description, reference, payment ,units_purchased} = transaction;
          return(

              <tr key={index}>
                  <td>{id}</td>
                  <td>{date}</td>
                  <td>{description}</td>
                  <td>{reference}</td>
                  <td>₦{payment}</td>
                  <td className="text-center">{units_purchased} Kwh</td>
              </tr>
          )
      })
  }



   render() {
      return (
          <div>

             <Table className="tablesorter" responsive>
                 <thead className="text-primary">
                 <tr>
                     <th>S/N</th>
                     <th>Transaction date</th>
                     <th>Description</th>
                     <th>Reference</th>
                     <th>Payment</th>
                     <th className="text-center">Balance</th>
                 </tr>
                 </thead>
                 <tbody>
                  {this.state.transactions}
                 </tbody>
             </Table>
               <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                 />

          </div>
      )
   }
}

export default PastPayment;

