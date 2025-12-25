const ticketSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ['free', 'static', 'pricePerAge', 'pricePerRegion', 'ageAndRegion'],
      required: true,
    },

    prices: {
      staticPrice: Number,

      pricePerAge: {
        children: Number,
        adults: Number,
        seniors: Number,
      },

      pricePerRegion: {
        egyptian: Number,
        foreign: Number,
      },

      ageAndRegion: {
        students: {
          egyptian: Number,
          foreign: Number,
        },
        adults: {
          egyptian: Number,
          foreign: Number,
        },
        seniors: {
          egyptian: Number,
          foreign: Number,
        },
      },
    },
  },
  { timestamps: true }
);