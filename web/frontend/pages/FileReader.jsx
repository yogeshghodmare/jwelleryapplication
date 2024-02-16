import React, { useEffect, useState } from 'react'
import Papa from "papaparse"
import { useAuthenticatedFetch } from "../hooks";
import { Page, Card, Button, LegacyCard } from '@shopify/polaris';

const FileReader = () => {
    let fetch = useAuthenticatedFetch();
    const [product, setProducts] = useState([])


    const [data, setData] = useState([])
    const [columnArray, setColumn] = useState([])
    const [values, setValues] = useState([])
    const HandleFile = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (result) {
                const columnArray = [];
                const valuesArray = [];
                result.data.map((d) => {
                    columnArray.push(Object.keys(d))
                    valuesArray.push(Object.values(d))
                })
                setData(result.data)
                setColumn(columnArray[0])
                setValues(valuesArray)
            }
        })
    }
    // console.log("data", data)

    console.log(values)
    const create = async () => {

        let request = await fetch("api/products")
        let respons = await request.json()
        // console.log(response)
        const titles = respons?.data?.map((item) => item.title);



        console.log("title", titles)

        try {



            const apiUrl = "/api/products/create";
            var response = "error";
            {
                values && values.map(async (value) => {
                    if (titles && titles.includes(value[1])) {
                        console.log("hello")
                    }
                    else {
                        response = await fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                title: value[1],
                                bodyHtml: value[2]

                            }),
                        });
                    }

                })
            }
            if (response === "error") {
                alert("Product created successfully:");
            } else {
                console.error("Failed to create product:");
            }

        } catch (error) {

            console.log(error)
        }
    }
    return (
        <Page>
            <LegacyCard sectioned>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <label htmlFor="imageUpload" className='custom-file-input' onChange={HandleFile} style={{ width: "100px" }}>Choose File</label>

                    <input className="hidden" id="imageUpload" name="file" type="file" accept=".csv" onChange={HandleFile} />

                </div>
                <br />
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black", margin: "5px auto", textAlign: "center" }}>
                    <thead>
                        <tr>
                            {columnArray.map((col, i) => (
                                <th key={i}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            values.map((v, i) => (
                                <tr key={i}>
                                    {v.map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {values.length === 0 ? "" : <Button primary type="submit" onClick={create}>submit</Button>}
                </div>
            </LegacyCard>
        </Page>
    )
}

export default FileReader