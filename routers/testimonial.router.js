const express = require("express");
const testimonialController = require("../controllers/testimonial.controller");

const testimonialRouter = express.Router();

//fetch all testimonial data
testimonialRouter.get("/testimonial", testimonialController.fetchTestimonial);

//post new testimonial
testimonialRouter.post("/testimonial", testimonialController.postTestimonial);

//delete testimonial data
testimonialRouter.delete(
  "/testimonial/:id",
  testimonialController.deleteTestimonial
);

module.exports = testimonialRouter;
