import { model, Schema, Document } from 'mongoose';
import { MONGO_CONNECTION_INSTANCES } from '@databases';
const dbConnection = MONGO_CONNECTION_INSTANCES['<database_name>'];

const DemoModelSchema: Schema = new Schema(
  {
    seller_id: { type: String, required: true, unique: true }, //  unique seller id
    name: String, //  website name (for example ajay fashion store)
    description: String, //  website description (for example fashonable cloths)
    favicon: String, //  favicon that represent brand
  },
  { timestamps: true },
);

const demoModel = dbConnection.model<Document>('DemoModel', DemoModelSchema);

export default demoModel;
