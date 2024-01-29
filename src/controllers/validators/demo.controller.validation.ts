/**
 * Add all the entry point validators to controller here
 */
import { z } from 'zod';

/**
 * naming convention - {controller_method_name_in_camelCase}{RequestBody/RequestQuery/RequestParam}Parser
 */
export const getDemoEntityRequestQueryParser = z.object({
  demo_param: z.string({
    required_error: 'demo_param is required',
    invalid_type_error: 'demo_param must be string'
  })
})