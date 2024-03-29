import React from 'react'
import { LegacyCard, DataTable, Thumbnail, Text, Page, Layout } from '@shopify/polaris'
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
const OrderDetail = ({ orderData }) => {
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
   


    let fetch = useAuthenticatedFetch();
    useEffect(() => {
        fetchOrders()
        fetchProducts()
        
    }, [])
    async function fetchProducts() {
        try {
            let request = await fetch("api/products")
            let response = await request.json()
            console.log(response)
            setProducts(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    async function fetchOrders() {
        try {
            let request = await fetch("/api/orders")
            let response = await request.json()
            setOrders(response.data || []);
            console.log("orders:", response)
        } catch (error) {

            console.log(error)
        }
    }
    async function deletehandle() {
        try {
            let request = await fetch("/api/products/delete", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 8947387302172}),
            });
    
            if (request.ok) {
                // Check if the response status is OK (200)
                let text = await request.text();
                console.log(text); // Output: "Product Deleted"
            } else {
                // Handle non-OK response here
                console.log("Failed to delete product");
            }
        } catch (e) {
            console.log("Not Deleted", e);
        }
    }

    console.log("order", orders)
    const order = orders.map((item, index) => {
        console.log(item?.line_items[0]?.product_id)
        return item?.line_items[0]?.product_id
    })
    // console.log("11", order)

    // console.log("products", products)
    var src1 = [];
    // var src2 = [];
    var src2 = src1.reverse();
    console.log("src1", src1)
    console.log("src2", src2)
    const src = products.map(product => {
        const hasProductInOrder = orders.some(order => order.line_items.some(item => item.product_id === product.id));
        if (hasProductInOrder) {
            src1.push(product.image.src);
        } else {
            return '0';
        }
    });


    // console.log("src1", src1);

    const rows = orders.map((item, index) => {
        return [

            <Thumbnail
                key={index}
                source={src2[index] || 'https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png'}
                alt={item.image?.alt || "image"}
            />,
            <Text key={index} variation="strong">{item.line_items[0].title}</Text>,
            <Text key={index} variation="positive">$ {item.total_price}</Text>,
            <Text key={index} variation="positive"> {item?.line_items[0]?.variant_title}</Text>,

            // <Button
            //     key={index}
            //     onClick={() => item.variants.length > 1 && handleShowVariants(index)} >
            //     Show Variants
            // </Button>,
            // <Collapsible key={index} open={showVariants[index]} >
            //     <Variants
            //         images={item.images}
            //         variants={item.variants}
            //         updateVariant={updateVariant}
            //         ProductID={item.id}
            //         isUpdating={isUpdating}
            //     />
            // </Collapsible>,
        ];
    });


    async function ordersfromDatabase() {
        var check=0;
        try {
            const response = await fetch('https://skyvisionshopify.in/KattDiamondApi/cart/products');
            const data = await response.json();
            console.log("extracted",data.data);
            setOrderdata(data.data);
            console.log("items",orderdata)
            check=1;
        } catch (error) {
            console.log('Error:', error);
        }
        if(check){
            deletefromdatabase()
        }
    }
    async function deletefromdatabase(){
        console.log("phase1")
        if(orderdata.length>0){
            await Promise.all(orderdata.map(async (item) => {
                console.log("phase2")
                try {
                    console.log("phase3")
                    let request = await fetch("/api/products/delete", {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: item.product_id }),
                    });
    
                    if (request.ok) {
                       
                        let text = await request.text();

                        try{
                            let req = await fetch("https://skyvisionshopify.in/KattDiamondApi/status", {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ product_status:1,product_id: item.product_id }),
                            });
                            console.log("updated",req)
                        }
                        catch(e){
                            console.log("set to 1")
                        }
                        console.log(text); 
                    } else {
                        
                        console.log("Failed to delete product");
                    }
                } catch (e) {
                    console.log("Not Deleted", e);
                }
            }));
        }
       
    }


    // function handledelete(){
    //     fetchOrders()
    //     fetchProducts()

    //     var productid=products.map((item)=> item.id)
    //     const ordersid = orders.flatMap((order) =>
    //     order.line_items.map((item) => item.product_id)
    // );
    

    //     console.log("orderdetail",ordersid)
    //     console.log("productsdetail",productid)
    //     ordersid.map(async (items,i)=>{
    //         if(productid.includes(items))
    //         {
    //             try {
    //                                 console.log("phase3")
    //                                 let request = await fetch("/api/products/delete", {
    //                                     method: 'DELETE',
    //                                     headers: {
    //                                         'Content-Type': 'application/json',
    //                                     },
    //                                     body: JSON.stringify({ id: items }),
    //                                 });
    //                                 if(request.ok)
    //                                 {
    //                                     console.log("Deleted Successfully")
    //                                 }
                    
    //                 }
    //                 catch(e){
    //                     console.log("Not Deleted Successfully")
    //                 }
    // }})
    // }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         ordersfromDatabase()
    //     }, 10000);})
    useEffect(()=>{
        ordersfromDatabase()
    })    

    return (
        <>
            <Layout sectioned>
                <LegacyCard>
                    <div style={{ width: "90vw", overflowY: 'auto', scrollBehavior: "smooth" }}>
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                                'text',
                                'text'
                            ]}
                            headings={[
                                'Image',
                                'Product Name',
                                'Price',
                                'varients'
                            ]}
                            rows={rows}
                        />
                    </div>
                    <button onClick={deletehandle}>Delete</button>
                </LegacyCard>
            </Layout>
        </>
    )
}

export default OrderDetail