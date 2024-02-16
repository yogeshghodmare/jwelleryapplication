import React, { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks';

const Createorder = () => {
  const fetch = useAuthenticatedFetch();
  const [order, setOrderData] = useState([]);
  const [products, setProducts] = useState([]);
  const [producttitle, setProductTitle] = useState([]);

  const fetchProducts = async () => {
    try {
      let request = await fetch('/api/products');
      let response = await request.json();
      const titles = response.data.map((item) => item.title);
      setProductTitle(titles);
    } catch (error) {
      console.log(error);
    }
  };

  const orders = async () => {
    try {
      const response = await fetch('http://localhost:8082/lelodata');
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const create = async () => {
    try {
      await fetchProducts();

      if (order.length > 0) {
        await Promise.all(
          order.map(async (item) => {
            if (producttitle && !producttitle.includes(item.title)) {
              try {
                if (item.title && item.description) {
                  const apiUrl = '/api/products/create';

                  const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title: item.title,
                      bodyHtml: item.description,
                    }),
                  });

                  if (response.ok) {
                    const responseData = await response.json();
                    console.log('Product created successfully:', responseData);
                  } else {
                    console.log('Failed to create product:', response);
                  }
                } else {
                  console.error('Item is missing title or description properties:', item);
                }
              } catch (error) {
                console.log(error);
              }
            } else {
              console.error('Item title not found in productTitles array:', item.title);
            }
          })
        );
      } else {
        console.error('Order array is empty');
        // Handle the case where the order array is empty
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     orders(); 
  //     fetchProducts()
  //   }, 5000); // Adjust the interval duration as needed (e.g., check every 5 seconds)

  //   return () => clearInterval(intervalId); // Clear the interval on component unmount
  // }, []);

  // useEffect(()=>{
   
  //     create();
    
  // },[order])

  return <div>Createorder</div>;
};

export default Createorder;
