const Offer = require("../models/offer")

const createOffer = async (req, res)=>{
    // const {code,offerType, value, description,startDate,endDate,eligibleProducts,active} = req.body;
    const {code, offerType, value, description, startDate, endDate, active} = req.body;
    try {
        // console.log(code, offerType, value, description,startDate,endDate,eligibleProducts,active);
        console.log(code, offerType, value, description, startDate, endDate, active);
        // const offer = new Offer({code, offerType, value, description,startDate,endDate,eligibleProducts,active});
        const offer = new Offer({code, offerType, value, description, startDate, endDate, active});
        console.log(offer)
        await offer.save();
        res.status(200).json({success:true,offer});
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Failed to create offer"})
    }
}

 const getOffer = async (req, res) => {
  const now = new Date();

  const active = await Offer.findOne({
    startDate: { $lte: now },
    endDate: { $gte: now },
    active: true
  });

  if (active) {
    return res.json({ status: "active", offer: active });
  }

  const upcoming = await Offer.findOne({
    startDate: { $gt: now },
    active: true
  }).sort({ startDate: 1 });

  if (upcoming) {
    return res.json({ status: "upcoming", offer: upcoming });
  }

  res.json({ status: "none" });
};

const deleteOffer = async (req, res) => {
    try {
        const offerId = req.params.id; // Getting the offer ID from the URL parameter
        console.log(offerId);

        // Find and delete the offer by _id
        const offer = await Offer.findByIdAndDelete(offerId);
        
        if (!offer) {
            return res.status(400).json({
                success: false,
                message: "Offer does not exist with this ID"
            });
        }

        res.status(200).json({
            success: true,
            message: "Offer deleted successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete offer",
            error: error.message
        });
    }
};

const updateOffer = async (req, res) => {
    const { id } = req.params; // Get the offer ID from the request parameters
    const { code, value, description, startDate, endDate} = req.body;

    try {
        // Find the offer by ID and update it
        const offer = await Offer.findByIdAndUpdate(
            id,
            { code, value, description, startDate, endDate},
            { new: true } // To return the updated offer
        );

        // Check if the offer exists
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        // Send the updated offer back
        res.status(200).json({ success: true, offer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update offer" });
    }
};

module.exports = {
    createOffer,
    getOffer,
    updateOffer,
    deleteOffer
}
