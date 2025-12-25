const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    // 1–to–1 relation with Place
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
      unique: true, // ENFORCES 1–to–1
    },

    type: {
      type: String,
      required: true,
      enum: ['standard', 'vip', 'family', 'student'] // optional, edit as needed
    },

    prices: {
      pricePerRegion: {
        egyptianPound: {
          type: Number,
          required: true,
        },
        foreign: {
          type: Number,
          required: true,
        },
      },

      pricePerAges: {
        children: {
          type: Number,
          required: true,
        },
        adults: {
          type: Number,
          required: true,
        },
        seniors: {
          type: Number,
          required: true,
        },
      },

      staticPrice: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);