import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import "../../styles/Forms/customforms.css";
const QuotationComponent = () => {
  const [formData, setFormData] = useState({
    price: "",
    advanceprice: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="styleform">
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
        <Typography variant="h6">Quotation</Typography>
      </Grid> */}
        <Grid item xs={6}>
          <TextField
            label="Price"
            fullWidth
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Advance"
            fullWidth
            name="advanceprice"
            value={formData.advanceprice}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default QuotationComponent;
