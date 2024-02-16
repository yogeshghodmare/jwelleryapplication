import {
  Card,
  Grid,
  TextField,
  LegacyStack,
  Button,
  Select,
  Label,
  LegacyCard,
  Tabs,
  Page
} from "@shopify/polaris";
import axios from 'axios'
import React from 'react';
import { useState, useCallback, useEffect } from "react";


export const Variants = ({ images, variants, updateVariant, ProductID, isUpdating }) => {
  const [selected, setSelected] = useState(0);

  const [deletecheck, setDeletecheck] = useState([]);

  // const [dummyvariants, setDummyvariants] = useState([...variants])


  console.log(images);
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const [checkedIndices, setCheckedIndices] = useState([]);

  const tabs = [
    {
      id: 0,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r10.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      accessibilityLabel: "All customers",
      panelID: "ring-1",
    },
    {
      id: 1,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r1.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      panelID: "ring-2",
    },
    {
      id: 2,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r2.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      accessibilityLabel: "All customers",
      panelID: "ring-3",
    },
    {
      id: 3,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r3.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      panelID: "ring-4",
    },
    {
      id: 4,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r4.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      accessibilityLabel: "All customers",
      panelID: "ring-5",
    },
    {
      id: 5,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r5.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      panelID: "ring-6",
    },
    {
      id: 6,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r6.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      accessibilityLabel: "All customers",
      panelID: "ring-7",
    },
    {
      id: 7,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r7.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      panelID: "ring-8",
    },
    {
      id: 8,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r8.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      accessibilityLabel: "All customers",
      panelID: "ring-9",
    },
    {
      id: 9,
      content: (
        <img
          width="50px"
          height="45px"
          src={
            "../images/r9.png" ||
            "https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png"
          }
        />
      ),
      panelID: "ring-10",
    },
  ];


  const handleCheckboxChange = (index) => {
    const isChecked = checkedIndices.includes(index);
    if (isChecked) {
      setCheckedIndices(checkedIndices.filter((i) => i !== index));
    } else {
      setCheckedIndices([...checkedIndices, index]);
    }
  };

  const handleDeleteCheckboxChange = (index) => {
    const isChecked = deletecheck.includes(index);
    if (isChecked) {
      setDeletecheck(deletecheck.filter((i) => i !== index));
    } else {
      setDeletecheck([...deletecheck, index]);
    }
  };
  const handleSave = async () => {
    if (checkedIndices) {
      try {
        await Promise.all(checkedIndices.map(async (index, i) => {
          const selectedTab = tabs[selected];
          const selectedVariant = variants[index];
          const postData = {
            ShapeId: selectedTab.id,
            ShapeImage: selectedTab.panelID,
            ShapeName: selectedTab.panelID,
            ProductId: ProductID,
            VarientId: index,
          };
          const response = await axios.post('https://skyvisionshopify.in/KattDiamondApi', postData);
          console.log('API Response:', response.data);
          getData();
          setCheckedIndices([])
        }));
      } catch (error) {
        console.error('Error in API request:', error);
      }
    }
  };

  const [fetchData, setFetchData] = useState([])
  const getData = async () => {
    try {

      const response = await axios.get(`https://skyvisionshopify.in/KattDiamondApi/${ProductID}`);

      console.log('API database:', response.data.data);

      setFetchData(response.data.data)

    } catch (error) {
      console.error('Error in API request:', error);

    }
  }

  const handleDelete = async () => {
    if (deletecheck.length > 0) {
      try {
        await Promise.all(
          deletecheck.map(async (item) => {
            const selectedTab = tabs[selected];
            const deleteData = {
              VarientId: item,
            };
            const response = await axios.delete(
              'https://skyvisionshopify.in/KattDiamondApi',
              { data: deleteData }
            );
            console.log('API Delete Response:', response);
          })
        );
        setDeletecheck([])
      } catch (error) {
        console.error('Error in API request:', error);
      }
    }
  };


  useEffect(() => {
    getData()
  }, [])

  console.log("fetchdata is", fetchData)
  useEffect(() => {
    getData()
  }, [handleDelete])

  var a = 0;
  var b = "no_data"
  function filtervarient(VarientId) {
    variants.map((item, i) => {
      if (item.id === VarientId) {
        a = i;
        b = item.title
      }
      return item.src;
    }
    )
  }

  useEffect(() => {
    setCheckedIndices([]);
    setDeletecheck([])
  }, [selected])


  function Checkvariants(varid) {
    if (!fetchData)
      return
    var a = 0
    console.log("code working")
    fetchData.map((item, i) => {
      if (item.VarientId == varid)
        a = 1;
    })
    if (a)
      return false
    else
      return true
  }

  useEffect(() => {
    setCheckedIndices([]);
  }, [])



  return (
    <div className="varientsresponsive">
      <div className="varients" >
        <br />
        <br />
        <br />

        <LegacyCard sectioned >
        <div className="Center-stone-type">
          <div >
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Diamond ">
            <span class="button-content">
              <img
                src="data:image/png;base64,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"
                height="20"
                width="20"
              />
              <span class="button-text">Diamond </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Lab Diamond " style={{width:"110px"}}
    >
            <span class="button-content">
              <img src="data:image/png;base64,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"
               height="20"
               width="20"
             />
              <span class="button-text" className="checkbox-stone">Lab Diamond </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Emerald">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Emerald </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Ruby ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Ruby </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Blue Sapphire ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
               height="20"
               width="20"
               />
              <span class="button-text">Blue Sapphire </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Pink Sapphire ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
               height="20"
               width="20"
               />
              <span class="button-text">Pink Sapphire </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Green Sapphire ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Green Sapphire </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Orange Sapphire  ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Orange Sapphire  </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Red Sapphire ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Red Sapphire </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Yellow Sapphire ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Yellow Sapphire</span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Amethyst ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
               height="20"
               width="20"
               />
              <span class="button-text">Amethyst </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Aquamarine ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
              />
              <span class="button-text">Aquamarine </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Citrine ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
            />
              <span class="button-text">Citrine </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Blue Topaz ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
               height="20"
               width="20"
             />
              <span class="button-text">Blue Topaz </span>
            </span>
          </button>
          </div>
          <div>
              <input type="checkbox" className="checkbox-stone"></input>
              <button class="buttonproductcust" data-toggle="tooltip" data-placement="top" title="Tanzanite ">
            <span class="button-content">
              <img src="data:image/png;base64,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"
              height="20"
              width="20"
            />
              <span class="button-text">Tanzanite </span>
            </span>
          </button>
          </div>
          
         
       
          </div>
        </LegacyCard>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>

          <Page fullWidth>

            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 12, lg: 6, xl: 6 }}>
                <LegacyCard.Section>
                  <LegacyCard sectioned title="Stones">
                    <div className="card1" style={{ display: "flex", overflowX: "auto" }}>

                      {variants && variants.map((variant, i) => (
                        <div key={i} >
                          {Checkvariants(variant.id) ? (<LegacyStack gap="500" key={variant.id}>
                            <div
                              style={{ display: "flex", flexDirection: "column" }}
                            >

                              <div style={{ marginRight: "30px" }}>

                                <img
                                  src={images[i + 1]?.src || 'https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png'}
                                  width={"50px"}
                                  height={"50px"}
                                ></img>
                              </div>

                              <label value={variant.title} type="text" style={{ marginRight: "30px", marginTop: "10px", marginBottom: "10px" }}>
                                {variant.title}
                              </label>
                              <input type="checkbox"
                                width="10px" height={"10px"}
                                checked={checkedIndices.includes(variant.id)}
                                onChange={() => handleCheckboxChange(variant.id)}
                                style={{ marginRight: "30px" }}
                              />
                            </div>
                          </LegacyStack>)
                            : ""
                          }

                          <br />
                        </div>
                      ))}
                    </div>
                    <br />
                    <Button primary onClick={handleSave} >Save</Button>
                  </LegacyCard>
                </LegacyCard.Section>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 12, lg: 6, xl: 6 }}>
                <br />
                <LegacyCard title="Selected Stones" sectioned>
                  <div className="card1" style={{ display: "flex", overflowX: "auto" }}>
                    {fetchData &&
                      fetchData
                        .filter(
                          (item, index, self) =>
                            index ===
                            self.findIndex(
                              (t) => t.VarientId === item.VarientId
                            )
                        )
                        .map((item, i) => (
                          <div key={i} style={{}}>
                            {item.ShapeId === selected && (
                              <LegacyStack gap="500">
                                {console.log(selected)}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div style={{ marginRight: "30px" }}>
                                    <img
                                      src={
                                        filtervarient(item.VarientId) ||
                                        images[a + 1]?.src ||
                                        'https://res.cloudinary.com/dci7ukl75/image/upload/v1668205411/defff_uhx4wz.png'
                                      }
                                      width={"50px"}
                                      height={"50px"}
                                    ></img>
                                  </div>
                                  <label
                                    value={b}
                                    type="text"
                                    style={{
                                      marginRight: "30px",
                                      marginTop: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {b}
                                  </label>
                                  <input
                                    type="checkbox"
                                    width="10px"
                                    height={"10px"}
                                    style={{ marginRight: "30px" }}
                                    checked={deletecheck.includes(item.VarientId)}
                                    onChange={() =>
                                      handleDeleteCheckboxChange(item.VarientId)
                                    }
                                  ></input>
                                </div>
                              </LegacyStack>
                            )}
                            <br />
                          </div>
                        ))}
                  </div>
                  <br />
                  <button className="button-11" onClick={handleDelete}>Unselect Stone</button>
                </LegacyCard>
              </Grid.Cell>
            </Grid>



          </Page>
        </Tabs>

      </div>
    </div>
  );
};
