var Y=Object.defineProperty;var V=(e,t,a)=>t in e?Y(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var F=(e,t,a)=>V(e,typeof t!="symbol"?t+"":t,a);import{c as H,s as m,i as v,t as _}from"./index-hUWsviX6.js";/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=H("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */class Z{read(t){return typeof window<"u"?localStorage.getItem(t):null}write(t,a){typeof window<"u"&&localStorage.setItem(t,a)}delete(t){typeof window<"u"&&localStorage.removeItem(t)}}class K{constructor(t){F(this,"adapter");this.adapter=t}read(t){return this.adapter.read(t)}write(t,a){this.adapter.write(t,a)}delete(t){this.adapter.delete(t)}getItem(t){return this.read(t)}setItem(t,a){this.write(t,a)}removeItem(t){this.delete(t)}getJson(t,a){try{const s=this.read(t);return s?JSON.parse(s):a}catch{return a}}setJson(t,a){this.write(t,JSON.stringify(a))}}const d=new K(new Z);/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const $={mapShiftToConstitutional(e,t,a=null,s=null){return{id:e.id,business_id:t,staff_id:e.operator_id,branch_id:a,department_id:s,start_time:e.opened_at,end_time:e.closed_at,status:e.status,total_revenue:e.closing_amount||0,expected_revenue:e.opening_float||0,variance:e.variance||0}},mapConstitutionalToLegacy(e){return{id:e.id,operator_id:e.staff_id,role:"staff",opening_float:Number(e.expected_revenue||0),closing_amount:e.total_revenue!==null?Number(e.total_revenue):null,variance:e.variance!==null?Number(e.variance):null,status:e.status,opened_at:e.start_time,closed_at:e.end_time}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */function o(e,t,a,s){return{success:!0,data:e,errors:null}}function c(e,t,a,s){return{success:!1,data:null,errors:e}}/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const b={isOnline(){return v()},async getShifts(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("carss_shift_core").select("*").order("start_time",{ascending:!1});if(a)console.warn(`Supabase shifts fetch error: ${a.message}`);else if(t){const s=(t||[]).map(n=>$.mapConstitutionalToLegacy(n));return o(s,"Shifts fetched online successfully")}}}catch(t){console.warn("Supabase error during shift fetch:",t)}const e=d.getJson("carss_shifts",[]);return o(e)},async getActiveShift(){try{const e=await this.getShifts();if(e.success&&e.data){const t=e.data.find(a=>a.status==="open")||null;return o(t,"Active shift fetched successfully")}return c(e.errors||["Failed to fetch shifts"],"Active shift fetch failed")}catch(e){return c([e.message||String(e)])}},async openShift(e,t,a,s){try{const n=await this.getShifts(),r=n.success&&n.data?n.data:[],i=new Date().toISOString(),u=r.map(h=>h.status==="open"?{...h,status:"closed",closing_amount:h.opening_float,variance:0,closed_at:i}:h),p={id:`SHIFT-REV-ACTIVE-${Date.now()}`,operator_id:e,role:t,opening_float:a,closing_amount:null,variance:null,status:"open",opened_at:new Date().toISOString(),closed_at:null};if(u.unshift(p),d.setJson("carss_shifts",u),this.isOnline()){await m.from("carss_shift_core").update({status:"closed",total_revenue:a,expected_revenue:a,variance:0,end_time:i}).eq("status","open");const h=(s==null?void 0:s.businessId)||"00000000-0000-0000-0000-000000000000",T=(s==null?void 0:s.branchId)||null,E=(s==null?void 0:s.departmentId)||null,C=$.mapShiftToConstitutional(p,h,T,E),{error:L}=await m.from("carss_shift_core").insert(C);if(L)return console.warn(`Supabase open shift insert failed: ${L.message}`),c([L.message],"Database open shift insert failed")}return o(p,"Shift opened successfully")}catch(n){return c([n.message||String(n)])}},async closeShift(e,t,a,s){try{const n=await this.getShifts(),i=(n.success&&n.data?n.data:[]).map(u=>u.id===e?{...u,status:"closed",closing_amount:t,variance:a,closed_at:s}:u);if(d.setJson("carss_shifts",i),this.isOnline()){const{error:u}=await m.from("carss_shift_core").update({status:"closed",total_revenue:t,expected_revenue:t,variance:a,end_time:s}).eq("id",e);if(u)return console.warn(`Supabase shift close failed: ${u.message}`),c([u.message],"Database close shift failed")}return o(void 0,"Shift closed successfully")}catch(n){return c([n.message||String(n)])}},async updateShift(e,t){try{const a=await this.getShifts(),n=(a.success&&a.data?a.data:[]).map(r=>r.id===e?{...r,...t}:r);if(d.setJson("carss_shifts",n),this.isOnline()){const r={};t.status!==void 0&&(r.status=t.status),t.opening_float!==void 0&&(r.expected_revenue=t.opening_float),t.closing_amount!==void 0&&(r.total_revenue=t.closing_amount,r.expected_revenue=t.closing_amount),t.variance!==void 0&&(r.variance=t.variance),t.opened_at!==void 0&&(r.start_time=t.opened_at),t.closed_at!==void 0&&(r.end_time=t.closed_at);const{error:i}=await m.from("carss_shift_core").update(r).eq("id",e);if(i)return console.warn(`Supabase shift update failed: ${i.message}`),c([i.message],"Database shift update failed")}return o(void 0,"Shift updated successfully")}catch(a){return c([a.message||String(a)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const B={mapLegacyToConstitutional(e,t="system",a=null,s="biz-1"){return{id:e.reference,amount:e.amount,status:e.status,payment_intent_id:e.terminal_id||null,shift_id:a,staff_id:t,business_id:s,payment_method:"pos",created_at:e.reconciled_at||new Date().toISOString()}},mapConstitutionalToLegacy(e,t="TERM-01"){return{reference:e.id,amount:Number(e.amount),terminal_id:e.payment_intent_id||t,status:e.status,reconciled_at:e.status==="reconciled"?e.created_at:null}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const R={isOnline(){return v()},async getTransactions(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("transactions").select("*").order("created_at",{ascending:!1});if(a)console.warn(`Supabase transactions fetch failed: ${a.message}`);else if(t){const s=t.map(n=>B.mapConstitutionalToLegacy(n));return o(s,"Transactions fetched online successfully")}}}catch(t){console.warn("Supabase error during transactions fetch:",t)}const e=d.getJson("carss_pos",[]);return o(e)},async getTransactionById(e){try{const t=await this.getTransactions();if(t.success&&t.data){const a=t.data.find(s=>s.reference===e)||null;return o(a,"Transaction retrieved successfully")}return c(t.errors||["Failed to read transactions"],"Transaction retrieval failed")}catch(t){return c([t.message||String(t)])}},async createTransaction(e,t,a,s="system",n=null,r){try{const i={reference:e,amount:t,terminal_id:a,status:"pending",reconciled_at:null},u=await this.getTransactions(),p=u.success&&u.data?u.data:[];if(p.unshift(i),d.setJson("carss_pos",p),this.isOnline()){const h=(r==null?void 0:r.businessId)||"00000000-0000-0000-0000-000000000000",T=B.mapLegacyToConstitutional(i,s,n,h),{error:E}=await m.from("transactions").insert(T);if(E)return console.warn(`Supabase transactions insert failed: ${E.message}`),c([E.message],"Database transaction insertion failed")}return o(i,"Transaction created successfully")}catch(i){return c([i.message||String(i)])}},async reconcileTransaction(e,t,a){try{const s=await this.getTransactions(),n=s.success&&s.data?s.data:[],r=new Date().toISOString(),i=n.map(u=>u.reference===e?{...u,status:"reconciled",reconciled_at:r}:u);if(d.setJson("carss_pos",i),this.isOnline()){const{error:u}=await m.from("transactions").update({status:"reconciled",staff_id:t}).eq("id",e);if(u)return console.warn(`Supabase transaction reconcile failed: ${u.message}`),c([u.message],"Database transaction reconcile failed")}return o(void 0,"Transaction reconciled successfully")}catch(s){return c([s.message||String(s)])}},async updateTransaction(e,t){try{const a=await this.getTransactions(),n=(a.success&&a.data?a.data:[]).map(r=>r.reference===e?{...r,...t}:r);if(d.setJson("carss_pos",n),this.isOnline()){const r={};t.status!==void 0&&(r.status=t.status),t.amount!==void 0&&(r.amount=t.amount),t.terminal_id!==void 0&&(r.payment_intent_id=t.terminal_id);const{error:i}=await m.from("transactions").update(r).eq("id",e);if(i)return console.warn(`Supabase transaction update failed: ${i.message}`),c([i.message],"Database transaction update failed")}return o(void 0,"Transaction updated successfully")}catch(a){return c([a.message||String(a)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const k={mapRowToPaymentIntention(e){return{id:e.id,reservation_id:e.order_id,amount:Number(e.expected_amount)||0,payment_method:e.payment_type||"cash",status:e.status==="reconciled"?"reconciled":e.status==="failed"?"failed":"pending",reconciliation_notes:e.rejection_reason||"",payment_reference:e.external_reference||"",shift_id:e.shift_id||"",created_at:e.created_at}},mapRowToPaymentDispute(e){return{id:e.id,business_id:e.business_id,branch_id:e.branch_id,payment_id:e.payment_id,dispute_reason:e.dispute_reason,status:e.status,opened_by:e.opened_by,resolved_by:e.resolved_by,resolution_note:e.resolution_note,created_at:e.created_at,resolved_at:e.resolved_at,paid_at:e.paid_at}},mapRowToBankTransfer(e){return{reference:e.reference||"",amount:Number(e.amount)||0,payer_name:e.sender||"Unknown",verification_status:e.status==="verified"?"verified":"pending",verified_by:null}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const y={isOnline(){return v()},async getPaymentIntents(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("payment_intents").select("*");if(a)console.warn("Supabase payment intents fetch error:",a.message);else if(t&&t.length>0){const s=t.map(n=>k.mapRowToPaymentIntention(n));return o(s,"Payment intents fetched online successfully")}}}catch(t){console.warn("Supabase payment intents fetch failed:",t)}const e=d.getJson("carss_payment_intentions",[]);return o(e)},async getPaymentIntent(e){try{const t=await this.getPaymentIntents();if(t.success&&t.data){const a=t.data.find(s=>s.id===e)||null;return o(a,"Payment intent found successfully")}return c(t.errors||["Failed to fetch payment intents"],"Payment intent retrieval failed")}catch(t){return c([t.message||String(t)])}},async createPaymentIntent(e){try{const t=await this.getPaymentIntents(),a=t.success&&t.data?t.data:[];if(a.unshift(e),d.setJson("carss_payment_intentions",a),this.isOnline()){const{error:s}=await m.from("payment_intents").insert({id:_(e.id),order_id:e.reservation_id?_(e.reservation_id):_("00000000-0000-0000-0000-000000000000"),org_id:_("00000000-0000-0000-0000-000000000000"),branch_id:_("00000000-0000-0000-0000-000000000000"),staff_id:_("00000000-0000-0000-0000-000000000000"),shift_id:e.shift_id?_(e.shift_id):_("00000000-0000-0000-0000-000000000000"),expected_amount:e.amount,payment_type:e.payment_method,status:e.status,external_reference:e.payment_reference,created_at:e.created_at,approval_status:"pending"});if(s)return console.warn("Supabase payment intents insert error:",s.message),c([s.message],"Database insert failed")}return o(e,"Payment intent created successfully")}catch(t){return c([t.message||String(t)])}},async verifyPayment(e){return o(void 0)},async recordPayment(e){try{if(this.isOnline()){const{error:t}=await m.from("payments").insert(e);if(t)return console.warn("Supabase payments write error:",t.message),c([t.message],"Database write error")}return o(void 0,"Payment recorded successfully")}catch(t){return c([t.message||String(t)])}},async recordPaymentAudit(e){try{if(this.isOnline()){const{error:t}=await m.from("payment_audit").insert(e);if(t)return console.warn("Supabase payment audit write error:",t.message),c([t.message],"Database audit error")}return o(void 0,"Payment audit recorded successfully")}catch(t){return c([t.message||String(t)])}},async updatePaymentIntentStatus(e,t,a){try{const s=await this.getPaymentIntents();if(s.success&&s.data){const n=s.data.map(r=>r.id===e?{...r,...t}:r);d.setJson("carss_payment_intentions",n)}if(this.isOnline()){const n={};t.status!==void 0&&(n.status=t.status),t.reconciliation_notes!==void 0&&(n.rejection_reason=t.reconciliation_notes),t.status==="reconciled"&&(n.approval_status="approved",n.approved_by=_(a||"00000000-0000-0000-0000-000000000000"),n.approved_at=new Date().toISOString());const{error:r}=await m.from("payment_intents").update(n).eq("id",_(e));if(r)return console.warn("Supabase payment intents update error:",r.message),c([r.message],"Database status update failed")}return o(void 0,"Payment intent status updated successfully")}catch(s){return c([s.message||String(s)])}},async getPaymentDisputes(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("payment_disputes").select("*").order("created_at",{ascending:!1});if(a)console.warn("Supabase payment disputes fetch error:",a.message);else if(t){const s=t.map(n=>k.mapRowToPaymentDispute(n));return o(s,"Payment disputes fetched online successfully")}}}catch(t){console.warn("Supabase payment disputes fetch failed:",t)}const e=d.getJson("carss_payment_disputes",[]);return o(e)},async createPaymentDispute(e){try{const t=await this.getPaymentDisputes(),a=t.success&&t.data?t.data:[];if(a.unshift(e),d.setJson("carss_payment_disputes",a),this.isOnline()){const{error:s}=await m.from("payment_disputes").insert({id:_(e.id),business_id:_(e.business_id||"00000000-0000-0000-0000-000000000000"),branch_id:_(e.branch_id||"00000000-0000-0000-0000-000000000000"),payment_id:_(e.payment_id),dispute_reason:e.dispute_reason,status:e.status,opened_by:_(e.opened_by||"00000000-0000-0000-0000-000000000000"),created_at:e.created_at});if(s)return console.warn("Supabase payment disputes insert error:",s.message),c([s.message],"Database dispute insertion failed")}return o(e,"Payment dispute created successfully")}catch(t){return c([t.message||String(t)])}},async resolvePaymentDispute(e,t,a){try{const s=a||"system",n=await this.getPaymentDisputes();if(n.success&&n.data){const r=n.data.map(i=>i.id===e?{...i,status:"resolved",resolution_note:t,resolved_by:s,resolved_at:new Date().toISOString()}:i);d.setJson("carss_payment_disputes",r)}if(this.isOnline()){const{error:r}=await m.from("payment_disputes").update({status:"resolved",resolution_note:t,resolved_by:_(s),resolved_at:new Date().toISOString()}).eq("id",_(e));if(r)return console.warn("Supabase disputes resolve update error:",r.message),c([r.message],"Database dispute resolution failed")}return o(void 0,"Payment dispute resolved successfully")}catch(s){return c([s.message||String(s)])}},async getBankTransfers(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("unmatched_payments").select("*").order("status",{ascending:!0});if(a)console.warn("Supabase bank transfers fetch error:",a.message);else if(t&&t.length>0){const s=t.map(n=>k.mapRowToBankTransfer(n));return o(s,"Bank transfers fetched online successfully")}}}catch(t){console.warn("Supabase bank transfers fetch failed:",t)}const e=d.getJson("carss_transfers",[]);return o(e)},async addBankTransfer(e){try{const t=await this.getBankTransfers(),a=t.success&&t.data?t.data:[];if(a.unshift(e),d.setJson("carss_transfers",a),this.isOnline()){const{error:s}=await m.from("unmatched_payments").insert({id:_(`00000000-0000-0000-0000-${e.reference.padEnd(12,"0").substring(0,12)}`),amount:e.amount,reference:e.reference,sender:e.payer_name,detected_at:new Date().toISOString(),status:"pending"});if(s)return console.warn("Supabase bank transfer insert error:",s.message),c([s.message],"Database bank transfer insertion failed")}return o(e,"Bank transfer added successfully")}catch(t){return c([t.message||String(t)])}},async verifyBankTransfer(e,t){try{const a=t||"system",s=await this.getBankTransfers();if(s.success&&s.data){const n=s.data.map(r=>r.reference===e?{...r,verification_status:"verified",verified_by:a}:r);d.setJson("carss_transfers",n)}if(this.isOnline()){const{error:n}=await m.from("unmatched_payments").update({status:"verified"}).eq("reference",e);if(n)return console.warn("Supabase bank transfer verify update error:",n.message),c([n.message],"Database bank transfer verification failed")}return o(void 0,"Bank transfer verified successfully")}catch(a){return c([a.message||String(a)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const O={isOnline(){return v()},async recordEvent(e){try{const t={...e,id:`evt-${Date.now()}-${Math.floor(Math.random()*1e4)}`,created_at:new Date().toISOString()},a=d.getJson("carss_audit_events",[]);if(a.unshift(t),d.setJson("carss_audit_events",a),this.isOnline()){const{error:s}=await m.from("audit_events").insert(t);s&&console.warn("Supabase audit_events write failed:",s.message)}return o(t,"Audit event recorded successfully")}catch(t){return c([t.message||String(t)])}},async recordAudit(e){try{const t={...e,id:`log-${Date.now()}-${Math.floor(Math.random()*1e3)}`,timestamp:new Date().toISOString()},a=d.getJson("carss_audit_logs",[]);if(a.unshift(t),d.setJson("carss_audit_logs",a),this.isOnline()){const{error:s}=await m.from("audit_logs").insert(t);s&&console.warn("Supabase audit_logs write failed:",s.message)}return o(t,"Audit log recorded successfully")}catch(t){return c([t.message||String(t)])}},async getTimeline(e){try{let t=[];if(this.isOnline()){let a=m.from("audit_events").select("*").order("created_at",{ascending:!1});e!=null&&e.operatorId&&(a=a.eq("actor_id",e.operatorId)),e!=null&&e.role&&(a=a.eq("actor_role",e.role)),e!=null&&e.resourceType&&(a=a.eq("resource_type",e.resourceType)),e!=null&&e.resourceId&&(a=a.eq("resource_id",e.resourceId)),e!=null&&e.eventCategory&&(a=a.eq("event_category",e.eventCategory)),e!=null&&e.shiftId&&(a=a.eq("shift_id",e.shiftId));const{data:s,error:n}=await a;if(n)console.warn("Supabase audit timeline fetch failed:",n.message);else if(s)return t=s,o(t,"Timeline fetched successfully")}return t=d.getJson("carss_audit_events",[]),e!=null&&e.operatorId&&(t=t.filter(a=>a.actor_id===e.operatorId)),e!=null&&e.role&&(t=t.filter(a=>a.actor_role===e.role)),e!=null&&e.resourceType&&(t=t.filter(a=>a.resource_type===e.resourceType)),e!=null&&e.resourceId&&(t=t.filter(a=>a.resource_id===e.resourceId)),e!=null&&e.eventCategory&&(t=t.filter(a=>a.event_category===e.eventCategory)),e!=null&&e.shiftId&&(t=t.filter(a=>a.shift_id===e.shiftId)),o(t,"Offline timeline fetched successfully")}catch(t){return c([t.message||String(t)])}},async getResourceHistory(e,t){return this.getTimeline({resourceType:e,resourceId:t})},async getOperatorHistory(e){return this.getTimeline({operatorId:e})},async getAuditLogs(){try{let e=[];if(this.isOnline()){const{data:t,error:a}=await m.from("audit_logs").select("*").order("timestamp",{ascending:!1});if(a)console.warn("Supabase audit logs fetch failed:",a.message);else if(t)return e=t,o(e,"Audit logs fetched successfully")}return e=d.getJson("carss_audit_logs",[]),o(e,"Offline audit logs fetched successfully")}catch(e){return c([e.message||String(e)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const W={mapRowToInventory(e){return{id:e.id,menu_item_id:e.sku||"",quantity:Number(e.current_stock)||0,min_alert_threshold:Number(e.min_stock)||0,location:e.description||"Main Deck"}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const w={isOnline(){return v()},async getCategories(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("product_categories").select("*").order("sort_order",{ascending:!0});if(a)console.warn("Supabase categories fetch error:",a.message);else if(t)return o(t,"Categories fetched online successfully")}}catch(t){console.warn("Supabase categories fetch failed:",t)}const e=d.getJson("carss_categories",[]);return o(e)},async getMenuItems(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("menu_items").select("*").eq("status","active");if(a)console.warn("Supabase menu items fetch error:",a.message);else if(t)return o(t,"Menu items fetched online successfully")}}catch(t){console.warn("Supabase menu items fetch failed:",t)}const e=d.getJson("carss_items",[]);return o(e)},async getInventory(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("inventory").select("*");if(a)console.warn("Supabase inventory fetch error:",a.message);else if(t&&t.length>0){const s=t.map(n=>W.mapRowToInventory(n));return o(s,"Inventory fetched online successfully")}}}catch(t){console.warn("Supabase inventory fetch failed:",t)}const e=d.getJson("carss_inventory",[]);return o(e)},async getInventoryItem(e){try{const t=await this.getInventory();if(t.success&&t.data){const a=t.data.find(s=>s.id===e||s.menu_item_id===e)||null;return o(a,"Inventory item retrieved successfully")}return c(t.errors||["Failed to read inventory"],"Inventory item retrieval failed")}catch(t){return c([t.message||String(t)])}},async updateInventory(e,t){try{if(this.isOnline()){const{error:s}=await m.from("inventory").update({current_stock:t}).eq("id",e);s&&console.warn("Supabase inventory update error:",s.message)}const a=await this.getInventory();if(a.success&&a.data){const s=a.data.map(n=>n.id===e?{...n,quantity:t}:n);d.setJson("carss_inventory",s)}return o(void 0,"Inventory updated successfully")}catch(a){return c([a.message||String(a)])}},async deductInventory(e,t){try{const a=await this.getInventory();if(!a.success||!a.data)return c(a.errors||["Could not read inventory"],"Deduct inventory failed");const s=a.data.find(n=>n.menu_item_id===e);if(s){const n=Math.max(0,s.quantity-t);await this.updateInventory(s.id,n)}return o(void 0,"Inventory deducted successfully")}catch(a){return c([a.message||String(a)])}},async restockInventory(e,t){try{const a=await this.getInventory();if(!a.success||!a.data)return c(a.errors||["Could not read inventory"],"Restock inventory failed");const s=a.data.find(n=>n.menu_item_id===e);if(s){const n=s.quantity+t;await this.updateInventory(s.id,n)}return o(void 0,"Inventory restocked successfully")}catch(a){return c([a.message||String(a)])}},async recordMovement(e,t,a,s){try{const n={id:`mov-${Date.now()}-${Math.floor(Math.random()*1e3)}`,inventory_item_id:e,quantity_changed:t,movement_type:a,notes:s,created_at:new Date().toISOString()},r=d.getJson("carss_inventory_movements",[]);if(r.push(n),d.setJson("carss_inventory_movements",r),this.isOnline()){const{error:i}=await m.from("inventory_movements").insert({id:n.id,product_id:e,quantity:t,movement_type:a,notes:s,created_at:n.created_at});i&&console.warn("Supabase inventory movement write error:",i.message)}return o(n,"Inventory movement recorded successfully")}catch(n){return c([n.message||String(n)])}},async getOperationalInventoryMovements(){try{const e=d.getItem("carss_op_inventory_movements");if(e)return o(JSON.parse(e),"Operational inventory movements fetched successfully")}catch(e){console.warn("Error reading local operational inventory movements",e)}return o([])},async addOperationalInventoryMovement(e){try{const t=d.getJson("carss_op_inventory_movements",[]);if(t.push(e),d.setJson("carss_op_inventory_movements",t),this.isOnline()){const{error:a}=await m.from("inventory_movements_v3").insert(e);a&&console.warn("Supabase operational inventory movement write error:",a.message)}return o(void 0,"Operational inventory movement added successfully")}catch(t){return c([t.message||String(t)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const N=[{id:"evt-seed-1",event_type:"open_shift",event_category:"Shifts",actor_id:"operator-active-02",actor_role:"manager",resource_type:"shift",resource_id:"SHIFT-REV-ACTIVE-02",resource_name:"Shift Active Registry",before_state:JSON.stringify({status:"closed",opening_float:0}),after_state:JSON.stringify({status:"open",opening_float:1e4}),notes:"Ignited active shift core and initialized counter float at ₦10,000",source_module:"operations",session_id:"session-77a8b",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-4*36e5).toISOString()},{id:"evt-seed-2",event_type:"add_reservation",event_category:"Reservations",actor_id:"customer-guest-101",actor_role:"staff",resource_type:"reservation",resource_id:"res-seed-992",resource_name:"Snooker VIP Lounge Table 4",before_state:"{}",after_state:JSON.stringify({customer_name:"Kolawole Sanusi",status:"confirmed",price:15e3}),notes:"Secured VIP reserve with instant food package attachment",source_module:"revenue",session_id:"session-9b2f1",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-3.5*36e5).toISOString()},{id:"evt-seed-3",event_type:"cash_movement:cash_out",event_category:"Cash Movements",actor_id:"operator-active-02",actor_role:"manager",resource_type:"cash_movement",resource_id:"cash-seed-44",resource_name:"Operations Expense Voucher",before_state:"{}",after_state:JSON.stringify({amount:12e3,purpose:"Diesel generator top-up"}),notes:"Discharged ₦12,000 cash from drawer for power plant fuel sustenance",source_module:"operations",session_id:"session-77a8b",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-3*36e5).toISOString()},{id:"evt-seed-4",event_type:"reconcile_pos",event_category:"POS",actor_id:"operator-active-02",actor_role:"manager",resource_type:"pos_transaction",resource_id:"POS-TX-9823",resource_name:"Terminal A POS Collection Receipt",before_state:JSON.stringify({reference:"POS-TX-9823",status:"pending"}),after_state:JSON.stringify({reference:"POS-TX-9823",status:"reconciled"}),notes:"Matched card collection voucher with terminal aggregate records",source_module:"operations",session_id:"session-77a8b",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-2.5*36e5).toISOString()},{id:"evt-seed-5",event_type:"verify_bank_transfer",event_category:"Transfers",actor_id:"operator-active-02",actor_role:"manager",resource_type:"bank_transfer",resource_id:"TRF-TX-1003",resource_name:"Standard Chartered Bank Remittance",before_state:JSON.stringify({reference:"TRF-TX-1003",verification_status:"pending"}),after_state:JSON.stringify({reference:"TRF-TX-1003",verification_status:"verified"}),notes:"Audited payer statement matching credit ledger reference directly",source_module:"operations",session_id:"session-77a8b",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-2*36e5).toISOString()},{id:"evt-seed-6",event_type:"inventory_movement:waste",event_category:"Stock Adjustments",actor_id:"staff-operator-33",actor_role:"staff",resource_type:"inventory_item",resource_id:"inv-2",resource_name:"Fried Chicken Stock",before_state:JSON.stringify({quantity:8}),after_state:JSON.stringify({quantity:3,change:-5}),notes:"Declared 5 units of kitchen spoilage from cooling fault",source_module:"operations",session_id:"session-2ab99",shift_id:"SHIFT-REV-ACTIVE-02",created_at:new Date(Date.now()-1.5*36e5).toISOString()}],j=()=>{const e=localStorage.getItem("carss_audit_events");if(!e)return localStorage.setItem("carss_audit_events",JSON.stringify(N)),N;try{return JSON.parse(e)}catch{return N}},g={isOnline(){return O.isOnline()},reseedSandbox(){return localStorage.setItem("carss_audit_events",JSON.stringify(N)),N},async emitEvent(e){const t=await O.recordEvent(e);return t.success&&t.data?t.data:{...e,id:`evt-${Date.now()}-${Math.floor(Math.random()*1e4)}`,created_at:new Date().toISOString()}},async getTimeline(e){const t=await O.getTimeline(e);return(t.success&&t.data?t.data:[]).filter(s=>{if(e!=null&&e.operatorId&&s.actor_id!==e.operatorId||e!=null&&e.role&&s.actor_role!==e.role||e!=null&&e.resourceType&&s.resource_type!==e.resourceType||e!=null&&e.resourceId&&s.resource_id!==e.resourceId||e!=null&&e.eventCategory&&s.event_category!==e.eventCategory||e!=null&&e.shiftId&&s.shift_id!==e.shiftId)return!1;const n=new Date(s.created_at).getTime();if(e!=null&&e.timeRange){const r=new Date().setHours(0,0,0,0),i=r-24*36e5,u=r-7*24*36e5,p=r-30*24*36e5;if(e.timeRange==="today"&&n<r||e.timeRange==="yesterday"&&(n<i||n>=r)||e.timeRange==="this_week"&&n<u||e.timeRange==="this_month"&&n<p)return!1}if(e!=null&&e.customStart){const r=new Date(e.customStart).getTime();if(n<r)return!1}if(e!=null&&e.customEnd){const r=new Date(e.customEnd).getTime();if(n>r)return!1}if(e!=null&&e.search){const r=e.search.toLowerCase(),i=s.actor_id.toLowerCase().includes(r),u=s.actor_role.toLowerCase().includes(r),p=s.notes.toLowerCase().includes(r),h=s.resource_name.toLowerCase().includes(r)||s.resource_id.toLowerCase().includes(r),T=s.event_type.toLowerCase().includes(r)||s.event_category.toLowerCase().includes(r);if(!i&&!u&&!p&&!h&&!T)return!1}return!0})},async getResourceHistory(e,t){return this.getTimeline({resourceType:e,resourceId:t})},async getOperatorHistory(e){return this.getTimeline({operatorId:e})},async detectAnomalies(){const e=[],t=j();t.filter(r=>r.event_type==="close_shift").forEach(r=>{try{const i=JSON.parse(r.after_state);i&&typeof i.variance=="number"&&i.variance!==0&&e.push({id:`anom-cash-${r.id}`,type:"cash_variance",severity:Math.abs(i.variance)>5e3?"high":"medium",title:"Significant Shift Cash Variance",description:`Shift closed by ${r.actor_id} with drawer discrepancy of ₦${i.variance.toLocaleString()}`,resource_id:r.resource_id,operator_id:r.actor_id,timestamp:r.created_at})}catch{}}),t.filter(r=>r.event_type.includes("inventory_movement")).forEach(r=>{try{const i=JSON.parse(r.after_state),u=i.quantity||i.quantity_changed||i.change||0;Math.abs(u)>=10&&(r.event_type.includes("waste")||r.event_type.includes("adjustment"))&&e.push({id:`anom-stock-${r.id}`,type:"inventory_variance",severity:"high",title:"Large Inventory Shrinkage Alert",description:`Operational adjustment of ${u} units declared for resource ${r.resource_name} under reason: "${r.notes}"`,resource_id:r.resource_id,operator_id:r.actor_id,timestamp:r.created_at})}catch{}});const n={};return t.forEach(r=>{(r.event_type==="reconcile_pos"||r.event_type==="verify_bank_transfer")&&(n[r.resource_id]||(n[r.resource_id]=[]),n[r.resource_id].push(r))}),Object.keys(n).forEach(r=>{const i=n[r];i.length>1&&e.push({id:`anom-reconcile-${r}`,type:"duplicate_reconciliation",severity:"high",title:"Potential Duplicate Collection Check",description:`Asset ${r} was resolved multiple times (${i.length} times) within active log intervals.`,resource_id:r,operator_id:i[0].actor_id,timestamp:i[0].created_at})}),t.forEach(r=>{r.actor_role==="staff"&&(r.event_type==="open_shift"||r.event_type==="close_shift")&&e.push({id:`anom-role-${r.id}`,type:"suspicious_activity",severity:"high",title:"Non-Privileged Critical Protocol Attempted",description:`Staff member ${r.actor_id} tried to dispatch shift controller transitions directly.`,resource_id:r.resource_id,operator_id:r.actor_id,timestamp:r.created_at})}),e},getBootstrapSQLWave4(){return`-- CARSS WAVE 4 CONSTITUTIONAL TRUST LAYER AUDIT SCHEMAS
-- Run this in Supabase query terminal to instantiate database storage for audit timeline streams.

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  before_state TEXT NOT NULL DEFAULT '{}',
  after_state TEXT NOT NULL DEFAULT '{}',
  notes TEXT,
  source_module TEXT NOT NULL,
  session_id TEXT,
  shift_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index critical fields for microsecond range queries and high efficiency timelines
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_category ON audit_events(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);
`}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */new Date(Date.now()-4*36e5).toISOString();new Date().toISOString();const M=(e,t)=>{const a=localStorage.getItem(e);if(!a)return localStorage.setItem(e,JSON.stringify(t)),t;try{return JSON.parse(a)}catch{return t}},J=(e,t)=>{localStorage.setItem(e,JSON.stringify(t))},A={isOnline:()=>b.isOnline(),async emitAudit(e){await O.recordAudit(e)},async getAuditLogs(){const e=await O.getAuditLogs();return e.success&&e.data?e.data:[]},async getShifts(){const e=await b.getShifts();return e.success&&e.data?e.data:[]},async getActiveShift(){const e=await b.getActiveShift();return e.success&&e.data?e.data:null},async openShift(e,t,a){const s=await b.openShift(e,t,a),n=s.success&&s.data?s.data:{id:`SHIFT-REV-ACTIVE-${Date.now()}`,operator_id:e,role:t,opening_float:a,closing_amount:null,variance:null,status:"open",opened_at:new Date().toISOString(),closed_at:null};return await this.emitAudit({operator_id:e,role:t,action:"open_shift",resource:`shift:${n.id}`}),await g.emitEvent({event_type:"open_shift",event_category:"Shifts",actor_id:e,actor_role:t,resource_type:"shift",resource_id:n.id,resource_name:`Active Shift Control [${n.id}]`,before_state:JSON.stringify({status:"closed",opening_float:0}),after_state:JSON.stringify({status:"open",opening_float:a}),notes:`Operator ${e} kicked off shift cycle successfully. Initialized cash drawer with a float of ₦${a.toLocaleString()}`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:n.id}),n},async closeShift(e,t,a,s){const r=(await this.getShifts()).find(l=>l.id===e),u=M("carss_payment_intentions",[]).filter(l=>l.shift_id===e&&l.status==="reconciled"),p=u.filter(l=>l.payment_method==="cash").reduce((l,f)=>l+f.amount,0),h=u.filter(l=>l.payment_method==="pos").reduce((l,f)=>l+f.amount,0),T=u.filter(l=>l.payment_method==="transfer").reduce((l,f)=>l+f.amount,0),C=(await this.getCashMovements(e)).reduce((l,f)=>f.movement_type==="cash_in"?l+f.amount:f.movement_type==="cash_out"?l-f.amount:f.movement_type==="correction"||f.movement_type==="adjustment"?l+f.amount:l,0),q=(r?r.opening_float:0)+p+C,D=t-q,z=new Date().toISOString();await b.closeShift(e,t,D,z),await this.emitAudit({operator_id:a,role:s,action:"close_shift",resource:`shift:${e}`});const U={shift_id:e,total_cash:p,total_pos:h,total_transfer:T,closing_amount:t,variance:D};await g.emitEvent({event_type:"close_shift",event_category:"Shifts",actor_id:a,actor_role:s,resource_type:"shift",resource_id:e,resource_name:`Shift Controller [${e}]`,before_state:JSON.stringify({status:"open"}),after_state:JSON.stringify(U),notes:`Closed shift drawer. Reported cash: ₦${t.toLocaleString()}. Computed cash variance: ₦${D.toLocaleString()}`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:e});const X=M("carss_shift_summaries",[]);return X.unshift(U),J("carss_shift_summaries",X),U},async getCashMovements(e){const t=M("carss_cash_movements",[]);return e?t.filter(a=>a.shift_id===e):t},async addCashMovement(e,t,a,s,n,r){const i={id:`cash-outflow-${Date.now()}`,shift_id:e,amount:t,movement_type:a,notes:s,operator_id:n,timestamp:new Date().toISOString()},u=await this.getCashMovements();return u.unshift(i),J("carss_cash_movements",u),await this.emitAudit({operator_id:n,role:r,action:`cash_movement:${a}`,resource:`shift:${e}`}),await g.emitEvent({event_type:`cash_movement:${a}`,event_category:"Cash Movements",actor_id:n,actor_role:r,resource_type:"cash_movement",resource_id:i.id,resource_name:`Drawer Overage/Outflow Logs [${i.id}]`,before_state:"{}",after_state:JSON.stringify(i),notes:`Executed drawer balance flow [${a}] of ₦${t.toLocaleString()}. Notes: "${s}"`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:e}),i},async getPOSTransactions(){const e=await R.getTransactions();return e.success&&e.data?e.data:[]},async addPOSTransaction(e,t,a,s="system",n="staff"){const r=await this.getActiveShift(),i=r?r.id:null,u=await R.createTransaction(e,t,a,s,i),p=u.success&&u.data?u.data:{reference:e,amount:t,terminal_id:a,status:"pending",reconciled_at:null};return await g.emitEvent({event_type:"add_pos_transaction",event_category:"POS",actor_id:s,actor_role:n,resource_type:"pos_transaction",resource_id:e,resource_name:`POS Journal Record [${e}]`,before_state:"{}",after_state:JSON.stringify(p),notes:`Ingested pending POS credit collection for terminal ${a} of size ₦${t.toLocaleString()}`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:i||""}),p},async reconcilePOSTransaction(e,t,a){await R.reconcileTransaction(e,t,a),await this.emitAudit({operator_id:t,role:a,action:"reconcile_pos",resource:`pos_tx:${e}`}),await g.emitEvent({event_type:"reconcile_pos",event_category:"POS",actor_id:t,actor_role:a,resource_type:"pos_transaction",resource_id:e,resource_name:`POS Journal Record [${e}]`,before_state:JSON.stringify({reference:e,status:"pending"}),after_state:JSON.stringify({reference:e,status:"reconciled"}),notes:"Reconciled POS credit transaction with manual counter slip verification",source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:""})},async getBankTransfers(){const e=await y.getBankTransfers();return e.success&&e.data?e.data:[]},async addBankTransfer(e,t,a,s="system",n="staff"){const r={reference:e,amount:t,payer_name:a,verification_status:"pending",verified_by:null};return await y.addBankTransfer(r),await g.emitEvent({event_type:"add_bank_transfer",event_category:"Transfers",actor_id:s,actor_role:n,resource_type:"bank_transfer",resource_id:e,resource_name:`Bank Transfer Remittance [${e}]`,before_state:"{}",after_state:JSON.stringify(r),notes:`Logged pending electronic bank remittance of ₦${t.toLocaleString()} from payer ${a}`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:""}),r},async verifyBankTransfer(e,t,a){await y.verifyBankTransfer(e),await this.emitAudit({operator_id:t,role:a,action:"verify_bank_transfer",resource:`bank_trf:${e}`}),await g.emitEvent({event_type:"verify_bank_transfer",event_category:"Transfers",actor_id:t,actor_role:a,resource_type:"bank_transfer",resource_id:e,resource_name:`Bank Transfer Remittance [${e}]`,before_state:JSON.stringify({reference:e,verification_status:"pending"}),after_state:JSON.stringify({reference:e,verification_status:"verified",verified_by:t}),notes:"Verified bank transfer remittance statement matching credited amount",source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:""})},async getInventoryMovements(){const e=await w.getOperationalInventoryMovements();return e.success&&e.data?e.data:[]},async addInventoryMovement(e,t,a,s,n,r){const i={id:`op-mov-${Date.now()}-${Math.floor(Math.random()*1e3)}`,inventory_id:e,quantity:t,movement_type:a,reason:s,operator_id:n,timestamp:new Date().toISOString()};return await w.addOperationalInventoryMovement(i),await this.emitAudit({operator_id:n,role:r,action:`inventory_movement:${a}`,resource:`inventory_item:${e}`}),await g.emitEvent({event_type:`inventory_movement:${a}`,event_category:"Stock Adjustments",actor_id:n,actor_role:r,resource_type:"inventory_item",resource_id:e,resource_name:`Operational Inventory Item [${e}]`,before_state:"{}",after_state:JSON.stringify(i),notes:`Logged inventory flow [${a}] of ${t} units. Reason: "${s}"`,source_module:"operations",session_id:`session-ops-${Date.now()}`,shift_id:""}),i},getBootstrapSQLWave3(){return`-- CARSS WAVE 3 OPERATIONAL LOOPS SCHEMA BLUEPRINT
-- Execute in Supabase SQL editor to create the high-integrity operations registries.

-- Active Shifts Registrars
CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  role TEXT NOT NULL,
  opening_float NUMERIC NOT NULL DEFAULT 0,
  closing_amount NUMERIC,
  variance NUMERIC,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Active Shift Summaries
CREATE TABLE IF NOT EXISTS shift_summaries (
  shift_id TEXT PRIMARY KEY REFERENCES shifts(id) ON DELETE CASCADE,
  total_cash NUMERIC NOT NULL DEFAULT 0,
  total_pos NUMERIC NOT NULL DEFAULT 0,
  total_transfer NUMERIC NOT NULL DEFAULT 0,
  closing_amount NUMERIC NOT NULL,
  variance NUMERIC NOT NULL
);

-- Custom Cash Movements
CREATE TABLE IF NOT EXISTS cash_movements (
  id TEXT PRIMARY KEY,
  shift_id TEXT REFERENCES shifts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('cash_in', 'cash_out', 'correction', 'adjustment')),
  notes TEXT,
  operator_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- POS Reconciliation Table
CREATE TABLE IF NOT EXISTS pos_transactions (
  reference TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  terminal_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reconciled')),
  reconciled_at TIMESTAMPTZ
);

-- Unmatched Payments (Electronic Remittance Audits) Table
CREATE TABLE IF NOT EXISTS unmatched_payments (
  id UUID PRIMARY KEY,
  amount NUMERIC NOT NULL,
  reference TEXT UNIQUE,
  sender TEXT,
  detected_at TIMESTAMPTZ,
  matched_order_id UUID,
  status TEXT DEFAULT 'pending'
);

-- Inventory Movement logs (Extended Operational Structure V3)
CREATE TABLE IF NOT EXISTS inventory_movements_v3 (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('stock_in', 'stock_out', 'consumption', 'waste', 'adjustment')),
  reason TEXT,
  operator_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- High-Integrity Comprehensive Audit Log Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
`}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const S={isOnline(){return v()},async getSavedTheme(){try{if(this.isOnline()){const{data:e,error:t}=await m.from("business_settings").select("value").eq("key","active_theme").single();if(e&&!t)return o(e.value,"Theme fetched successfully")}}catch(e){console.warn("Supabase fetch theme_settings failed:",e)}return o("midnight_gold")},async saveTheme(e){try{if(this.isOnline()){const{error:t}=await m.from("business_settings").upsert({key:"active_theme",value:e});if(t)return console.warn("Supabase upsert theme_settings failed:",t.message),c([t.message],"Database theme save failed")}return o(void 0,"Theme saved successfully")}catch(t){return c([t.message||String(t)])}},async getCategories(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("product_categories").select("*").order("sort_order",{ascending:!0});if(a)console.warn("Supabase menu_categories fetch failed:",a.message);else if(t)return o(t,"Categories fetched online successfully")}}catch(t){console.warn("Supabase menu_categories fetch failed:",t)}const e=d.getJson("carss_categories",[]);return o(e)},async getMenuItems(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("menu_items").select("*").eq("status","active");if(a)console.warn("Supabase menu_items fetch failed:",a.message);else if(t)return o(t,"Menu items fetched online successfully")}}catch(t){console.warn("Supabase menu_items fetch failed:",t)}const e=d.getJson("carss_items",[]);return o(e)},async getPromotions(){try{if(this.isOnline()){const{data:t,error:a}=await m.from("price_rules").select("*").eq("is_active",!0);if(a)console.warn("Supabase promotions fetch failed:",a.message);else if(t)return o(t,"Promotions fetched online successfully")}}catch(t){console.warn("Supabase promotions fetch failed:",t)}const e=d.getJson("carss_promotions",[]);return o(e)}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const I={mapReservationToBooking(e,t){const a=(t==null?void 0:t.operatorId)||null,s=(t==null?void 0:t.operatorId)||"guest-customer",n=(t==null?void 0:t.businessId)||"biz-1",r=`${e.booking_date}T${e.booking_time}:00.000Z`;return{id:e.id,guest_name:e.customer_name,guest_email:e.customer_email||"",guest_phone:e.customer_phone,source:e.reservation_type,check_in:r,status:e.status,business_id:n,customer_id:a,created_by:s,created_at:e.created_at||new Date().toISOString(),quantity_people:e.quantity_people,special_requests:e.special_requests||""}},mapBookingToReservation(e,t){let a="",s="";if(e.check_in){const r=e.check_in.split(/[ T]/);a=r[0]||"",r[1]&&(s=r[1].substring(0,5))}const n=(t==null?void 0:t.ticket_code)||`ONS-${Math.floor(1e5+Math.random()*9e5)}`;return{id:e.id,customer_name:e.guest_name,customer_email:e.guest_email||"",customer_phone:e.guest_phone,reservation_type:e.source,quantity_people:e.quantity_people??(t==null?void 0:t.quantity_people)??2,booking_date:a,booking_time:s,special_requests:e.special_requests??(t==null?void 0:t.special_requests)??"",status:e.status,ticket_code:n,created_at:e.created_at||new Date().toISOString()}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */const P={isOnline(){return v()},async createBooking(e,t){try{const a=I.mapReservationToBooking(e,t);if(this.isOnline()){const{data:s,error:n}=await m.from("bookings").insert(a).select().single();if(n)return console.warn("Supabase bookings write failed:",n.message),c([n.message],"Database write failed");const r=I.mapBookingToReservation(s||a,e);return o(r,"Booking created online successfully")}else{const s=d.getJson("carss_bookings",[]);s.unshift(a),d.setJson("carss_bookings",s);const n=d.getJson("carss_reservations",[]);return n.unshift(e),d.setJson("carss_reservations",n),o(e,"Booking created offline successfully")}}catch(a){return c([a.message||String(a)])}},async updateBookingStatus(e,t){try{if(this.isOnline()){const{error:a}=await m.from("bookings").update({status:t}).eq("id",e);if(a)return console.warn("Supabase bookings status update failed:",a.message),c([a.message],"Database status update failed")}else{const s=d.getJson("carss_bookings",[]).map(i=>i.id===e?{...i,status:t}:i);d.setJson("carss_bookings",s);const r=d.getJson("carss_reservations",[]).map(i=>i.id===e?{...i,status:t}:i);d.setJson("carss_reservations",r)}return o(void 0,"Booking status updated successfully")}catch(a){return c([a.message||String(a)])}},async getBookings(e){try{if(this.isOnline()){let s=m.from("bookings").select("*");e!=null&&e.businessId&&(s=s.eq("business_id",e.businessId));const{data:n,error:r}=await s.order("created_at",{ascending:!1});if(r)console.warn("Supabase bookings fetch failed:",r.message);else if(n){const i=(n||[]).map(u=>I.mapBookingToReservation(u));return o(i,"Bookings fetched online successfully")}}let t=d.getJson("carss_bookings",[]);if(t.length===0){const s=d.getJson("carss_reservations",[]);s.length>0&&(t=s.map(n=>I.mapReservationToBooking(n,e)),d.setJson("carss_bookings",t))}const a=t.map(s=>I.mapBookingToReservation(s));return o(a,"Bookings fetched offline successfully")}catch(t){return c([t.message||String(t)])}}};/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const G=[{id:"cat-entrees",name:"Gourmet Entrees",description:"Savory slow-cooked mains and chicken specialties",sort_order:1},{id:"cat-burgers",name:"Burgers & Sandwiches",description:"Succulent gourmet stacks, fresh toppings and house fries",sort_order:2},{id:"cat-pastapizza",name:"Pizza & Sourdough Pasta",description:"Flown-in pizza and freshly-tossed rigatoni",sort_order:3},{id:"cat-coffee",name:"Coffee Series",description:"Freshly-pressed single origin Arabica beans",sort_order:4},{id:"cat-noncoffee",name:"Non-Coffee Brews",description:"Creamy iced blends, matcha lattes, and exotic shakes",sort_order:5}],Q=[{id:"menu-grilled-chicken",category_id:"cat-entrees",name:"Grilled Chicken",description:"Moist, slow-roasted chicken quarter glazed with home-grown spices, served with local pepper sauce.",price:5e3,image_url:"https://images.unsplash.com/photo-1598103442097-8b74394b98c6?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["High Protein","Chef Specialty"],status:"active",is_popular:!0,is_featured:!1,upsell_item_id:"menu-coffee-area",upsell_message:"Accompany your delicious chicken with our chilling signature Ice Coffee Area!"},{id:"menu-fried-chicken",category_id:"cat-entrees",name:"Fried Chicken",description:"Deep fried crispy golden coat chicken breast seasoned heavily with constitutional spice blends.",price:5e3,image_url:"https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Crispy","Popular"],status:"active"},{id:"menu-chicken-chips",category_id:"cat-entrees",name:"Chicken & Chips",description:"Rich portion of crispy tavern style French fries paired beautifully with a fried whole chicken piece.",price:7e3,image_url:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Bestseller","Highly Recommended"],status:"active",is_featured:!0,recommend_message:"Our customers rate this item 5/5 for game night snacking."},{id:"menu-cheese-burger",category_id:"cat-burgers",name:"Cheese Burger",description:"Flame-grilled succulent beef patty with melted signature cheddar, local pickles, and master spread on brioche buns.",price:5050,image_url:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Classic","Flavour Bomb"],status:"active",is_popular:!0},{id:"menu-chicken-burger",category_id:"cat-burgers",name:"Chicken Burger",description:"Crispy golden fried chicken breast fillet layered with organic shred butter lettuce and executive garlic sauce.",price:5e3,image_url:"https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Spicy Option"],status:"active"},{id:"menu-beef-burger",category_id:"cat-burgers",name:"Beef Burger",description:"Premium double-patty brisket beef blend with fresh romaine lettuce, tomato slice, and rich signature dark glaze.",price:5e3,image_url:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Double Meat"],status:"active"},{id:"menu-spicy-pasta",category_id:"cat-pastapizza",name:"Spicy Pasta",description:"Rigatoni tossed expertly in a zesty, fiery native chili cayenne tomato reduction and fresh coriander greens.",price:7e3,image_url:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Fiery","Local Spices"],status:"active",is_popular:!0},{id:"menu-special-pasta",category_id:"cat-pastapizza",name:"Special Pasta",description:"Penne tossed with slow-cooked aromatic herbs, light whole cream dressing, and succulent grilled chicken strips.",price:6e3,image_url:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Mild Creamy"],status:"active"},{id:"menu-big-pasta",category_id:"cat-pastapizza",name:"Big Pasta",description:"Grand shareable platter of premium spaghetti, rich baseline-infused marinara, and mixed farm-protein chunks.",price:1e4,image_url:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Shareable Platter","Epic Edition"],status:"active"},{id:"menu-special-pizza",category_id:"cat-pastapizza",name:"Special Pizza",description:"Wood-fired active sourdough crust topped with signature local sausage, minced visual basil and double cheese.",price:7020,image_url:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Fresh Sourdough"],status:"active",is_popular:!0},{id:"menu-small-pizza",category_id:"cat-pastapizza",name:"Small Pizza",description:"Cozy personal sized crust loaded with molten premium mozzarella, mountain herbs, and classic beef pepperoni.",price:5e3,image_url:"https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Quick Bite"],status:"active"},{id:"menu-big-pizza",category_id:"cat-pastapizza",name:"Big Pizza",description:"Constitutional shareable size dual-layered cheese, shredded smoked farm pork, mushrooms, and sweet olives.",price:1e4,image_url:"https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Party Size"],status:"active"},{id:"menu-coffee-area",category_id:"cat-coffee",name:"Ice Coffee Area",description:"Signature cold brewed espresso with velvety heavy sweet milk foam and organic sugar reduction.",price:15e3,image_url:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Area Favorite","Sweet Creamy"],status:"active",is_popular:!0,is_featured:!0,recommend_message:"Pair with Big Pizza for the ultimate lounge session refreshment."},{id:"menu-coffee-vanilla",category_id:"cat-coffee",name:"Ice Coffee Vanilla",description:"Double robust espresso shot blended with pasteurized raw milk and exquisite Madagascar vanilla pod juice.",price:17005,image_url:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Classic Sweet"],status:"active"},{id:"menu-coffee-brown-sugar",category_id:"cat-coffee",name:"Ice Coffee Brown Sugar",description:"Bold dark espresso dripping over slow-caramelized brown sugar cane crystals and whole ice blocks.",price:15e3,image_url:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Caramelized"],status:"active"},{id:"menu-coffee-avocado",category_id:"cat-coffee",name:"Ice Coffee Avocado",description:"Exotic and rich mash of organic buttery Hass avocado, double espresso, and cold sugar milk cloud.",price:17e3,image_url:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Exotic Blend","Creamy Health"],status:"active"},{id:"menu-coffee-caramel",category_id:"cat-coffee",name:"Ice Coffee Caramel",description:"Iced double espresso drizzled with homemade roasted salted butterscotch caramel paste.",price:15e3,image_url:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Sweet Drizzle"],status:"active"},{id:"menu-coffee-hot",category_id:"cat-coffee",name:"Hot Black Coffee",description:"Steaming aromatic single-origin organic Arabica, handpressed and served black with a golden crema.",price:12e3,image_url:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Zero Sugar","Intense"],status:"active"},{id:"menu-red-velvet",category_id:"cat-noncoffee",name:"Ice Red Velvet",description:"Chilled premium dark cocoa cream with dynamic vanilla accents and sweet red-crust cookie crumbles.",price:15e3,image_url:"https://images.unsplash.com/photo-1586944210601-3f113f7f985b?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Dessert Brew","Non-Caffeine"],status:"active"},{id:"menu-salted-caramel",category_id:"cat-noncoffee",name:"Ice Salted Caramel",description:"Thick sweet salted butterscotch paste whipped with whole organic milk and poured over shaved crystal ice.",price:15e3,image_url:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Mineral Sweet"],status:"active"},{id:"menu-greentea-latte",category_id:"cat-noncoffee",name:"Ice Green Tea Latte",description:"Ceremonial Uji matcha tea leaves whisked into chilled organic oat milk and raw maple droplets.",price:17e3,image_url:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Japanese Matcha","Superfood"],status:"active",is_popular:!0},{id:"menu-strawberry",category_id:"cat-noncoffee",name:"Ice Strawberry Milk",description:"Luscious hand-muddled fresh strawberry syrup layered over frothy cream and raw honey swirl.",price:15e3,image_url:"https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Fruit Delight"],status:"active"},{id:"menu-chocolate-almond",category_id:"cat-noncoffee",name:"Ice Chocolate Almond",description:"Indulgent cocoa melted with toasted organic almond milk, topped with rich chocolate shavings.",price:17e3,image_url:"https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Nutty Chocolate"],status:"active"},{id:"menu-vanilla-latte",category_id:"cat-noncoffee",name:"Ice Vanilla Milk",description:"Iced pasteurized sweet milk infused with natural pod vanilla extract and a light dash of whipped cream.",price:17e3,image_url:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400",is_available:!0,tags:["Velvety Sweet"],status:"active"}],x=(e,t)=>{localStorage.setItem(e,JSON.stringify(t))},se={isOnline:()=>S.isOnline(),async getSavedTheme(){const e=await S.getSavedTheme();return e.success&&e.data?e.data:"midnight_gold"},async saveTheme(e){await S.saveTheme(e),x("carss_active_theme",e)},async getCategories(){const e=await S.getCategories();return e.success&&e.data?e.data:G},async getMenuItems(){const e=await S.getMenuItems();return e.success&&e.data?e.data:Q},async getInventory(){const e=await w.getInventory();return e.success&&e.data?e.data:[]},async updateItemInventory(e,t){if((await w.deductInventory(e,t)).success){const n=(await this.getInventory()).find(r=>r.menu_item_id===e);n&&(A.addInventoryMovement(n.id,-t,"consumption","Automated reservation checkout deduction","customer-guest","customer"),A.emitAudit({operator_id:"customer-guest",role:"customer",action:"automatic_inventory_consumption",resource:`inventory_item:${n.id}`}))}},async restockItemInventory(e,t){if((await w.restockInventory(e,t)).success){const n=(await this.getInventory()).find(r=>r.menu_item_id===e);n&&(A.addInventoryMovement(n.id,t,"stock_in","Staff replenishment of menu item","active-staff-member","staff"),A.emitAudit({operator_id:"active-staff-member",role:"staff",action:"inventory_restock",resource:`inventory_item:${n.id}`}))}},async logMovement(e,t,a,s){await w.recordMovement(e,t,a,s)},async getPromotions(){const e=await S.getPromotions();return e.success&&e.data?e.data:[]},async getReservations(){const e=await P.getBookings();return e.success&&e.data?e.data:[]},async placeReservation(e){const t=`res-${Date.now()}`,a=`ONS-${Math.floor(1e5+Math.random()*9e5)}`,s={...e,id:t,status:"confirmed",ticket_code:a,created_at:new Date().toISOString()},n=await P.createBooking(s),r=n.success&&n.data?n.data:s;return await g.emitEvent({event_type:"place_reservation",event_category:"Reservations",actor_id:"customer-guest",actor_role:"staff",resource_type:"reservation",resource_id:r.id,resource_name:`Reservation Voucher for [${r.customer_name}]`,before_state:"{}",after_state:JSON.stringify(r),notes:`Guest logged reservation of type ${r.reservation_type} for ${r.quantity_people} people. Confirmed Code: ${r.ticket_code}`,source_module:"revenue",session_id:`session-rev-${Date.now()}`,shift_id:""}),r},async updateReservationStatus(e,t){await P.updateBookingStatus(e,t)},async getPaymentIntentions(){const e=await y.getPaymentIntents();return e.success&&e.data?e.data:[]},async generatePaymentIntention(e){const t=`pay-${Date.now()}`,a=`TX-${Date.now()}-${Math.floor(100+Math.random()*900)}`,s={...e,id:t,payment_reference:a,status:"pending",created_at:new Date().toISOString()};return await y.createPaymentIntent(s),await g.emitEvent({event_type:"generate_payment_intent",event_category:"Payments",actor_id:"customer-guest",actor_role:"staff",resource_type:"payment",resource_id:s.id,resource_name:`Payment Intent [${s.payment_reference}]`,before_state:"{}",after_state:JSON.stringify(s),notes:`Initiated reservation checkout invoice payment intentions of â‚¦${s.amount.toLocaleString()} via ${s.payment_method.toUpperCase()}`,source_module:"revenue",session_id:`session-rev-${Date.now()}`,shift_id:s.shift_id||""}),s},async reconcilePaymentIntention(e,t){const s=(await this.getPaymentIntentions()).find(n=>n.id===e);if(await y.updatePaymentIntentStatus(e,{status:"reconciled",reconciliation_notes:t}),s){const n=s,r=`payment-${e}`;await y.recordPayment({id:_(r),business_id:_("biz-1"),customer_id:_("customer-dummy"),amount_ngn:Math.floor(n.amount),amount:n.amount,method:n.payment_method,status:"verified",reference:n.payment_reference,note:t,created_by:_("customer-dummy"),verified_by:_("active-manager-sim"),verified_at:new Date().toISOString(),branch_id:_("branch-1"),org_id:_("org-1"),order_id:n.reservation_id?_(n.reservation_id):_("reservation-dummy"),booking_id:n.reservation_id?_(n.reservation_id):_("reservation-dummy"),created_at:n.created_at,updated_at:new Date().toISOString()}),await y.recordPaymentAudit({id:_(`audit-payment-${e}`),business_id:_("biz-1"),payment_id:_(r),branch_id:_("branch-1"),action:"reconcile",actor_user_id:_("active-manager-sim"),note:t,meta:{payment_reference:n.payment_reference,amount:n.amount,reconciled_at:new Date().toISOString()}}),await g.emitEvent({event_type:"reconcile_payment_intent",event_category:"Payments",actor_id:"active-manager-sim",actor_role:"manager",resource_type:"payment",resource_id:e,resource_name:`Payment Intent [${n.payment_reference}]`,before_state:JSON.stringify(n),after_state:JSON.stringify({...n,status:"reconciled"}),notes:`Reconciled booking checkout payment voucher manually. Reconciliation Memo: "${t}"`,source_module:"revenue",session_id:`session-ops-${Date.now()}`,shift_id:n.shift_id||""})}},async getPaymentDisputes(){const e=await y.getPaymentDisputes();return e.success&&e.data?e.data:[]},async createPaymentDispute(e,t){const a=`disp-${Date.now()}`,s={id:a,business_id:"biz-1",branch_id:"branch-1",payment_id:e,dispute_reason:t,status:"open",opened_by:"active-manager-sim",created_at:new Date().toISOString()};await y.createPaymentDispute(s),await g.emitEvent({event_type:"create_payment_dispute",event_category:"Payments",actor_id:"active-manager-sim",actor_role:"manager",resource_type:"payment",resource_id:e,resource_name:`Payment Dispute [${a}]`,before_state:"{}",after_state:JSON.stringify(s),notes:`Opened dispute for payment ID ${e}. Reason: "${t}"`,source_module:"revenue",session_id:`session-ops-${Date.now()}`,shift_id:""})},async resolvePaymentDispute(e,t){const s=(await this.getPaymentDisputes()).find(n=>n.id===e);if(await y.resolvePaymentDispute(e,t),s){const n=s;await g.emitEvent({event_type:"resolve_payment_dispute",event_category:"Payments",actor_id:"active-manager-sim",actor_role:"manager",resource_type:"payment",resource_id:e,resource_name:`Payment Dispute [${e}]`,before_state:JSON.stringify(n),after_state:JSON.stringify({...n,status:"resolved",resolution_note:t}),notes:`Resolved payment dispute manually. Resolution Note: "${t}"`,source_module:"revenue",session_id:`session-ops-${Date.now()}`,shift_id:""})}},getBootstrapSQL(){return`-- CARSS REVENUE TERRITORY CONSTITUTIONAL SQL BLUEPRINT
-- Copy and execute this code in your Supabase SQL Editor (https://supabase.com)

-- Create Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 1
);

-- Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  status TEXT DEFAULT 'active',
  is_popular BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  upsell_item_id TEXT,
  upsell_message TEXT,
  recommend_message TEXT
);

-- Create Constitutional Inventory Table (Certified Table under Wave 5 Constitution)
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  business_id TEXT,
  branch_id TEXT,
  department_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  current_stock INT NOT NULL DEFAULT 0,
  unit TEXT,
  category TEXT,
  cost_price NUMERIC,
  min_stock INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Inventory Movements log Table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  movement_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  badge_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  target_menu_item_id TEXT
);

-- Create Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  reservation_type TEXT NOT NULL,
  quantity_people INT NOT NULL,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  ticket_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payment Intents Table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY,
  order_id UUID,
  org_id UUID,
  branch_id UUID,
  staff_id UUID,
  shift_id UUID,
  expected_amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  external_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejected_by UUID,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  approval_status TEXT DEFAULT 'pending'
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount_ngn BIGINT,
  amount NUMERIC,
  method TEXT,
  status TEXT,
  reference TEXT UNIQUE,
  evidence_url TEXT,
  note TEXT,
  created_by UUID,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  reversed_by UUID,
  reversed_at TIMESTAMPTZ,
  reversal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  org_id UUID,
  order_id UUID,
  booking_id UUID,
  provider TEXT
);

-- Create Payment Audit Table
CREATE TABLE IF NOT EXISTS payment_audit (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_user_id UUID,
  note TEXT,
  meta JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payment Disputes Table
CREATE TABLE IF NOT EXISTS payment_disputes (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  opened_by UUID,
  resolved_by UUID,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Create Theme Settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed Initial Categories
INSERT INTO menu_categories (id, name, description, sort_order) VALUES
('cat-entrees', 'Gourmet Entrees', 'Savory slow-cooked mains and chicken specialties', 1),
('cat-burgers', 'Burgers & Sandwiches', 'Succulent gourmet stacks, fresh toppings and house fries', 2),
('cat-pastapizza', 'Pizza & Sourdough Pasta', 'Flown-in pizza and freshly-tossed rigatoni', 3),
('cat-coffee', 'Coffee Series', 'Freshly-pressed single origin Arabica beans', 4),
('cat-noncoffee', 'Non-Coffee Brews', 'Creamy iced blends, matcha lattes, and exotic shakes', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, tags, status, is_popular, is_featured, upsell_item_id, upsell_message) VALUES
('menu-grilled-chicken', 'cat-entrees', 'Grilled Chicken', 'Moist, slow-roasted chicken quarter glazed with home-grown spices, served with local pepper sauce.', 5000, 'https://images.unsplash.com/photo-1598103442097-8b74394b98c6?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['High Protein', 'Chef Specialty'], 'active', TRUE, FALSE, 'menu-coffee-area', 'Accompany your delicious chicken with our chilling signature Ice Coffee Area!'),
('menu-chicken-chips', 'cat-entrees', 'Chicken & Chips', 'Rich portion of crispy tavern style French fries paired beautifully with a fried whole chicken piece.', 7000, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['Bestseller', 'Highly Recommended'], 'active', FALSE, TRUE, NULL, NULL),
('menu-coffee-area', 'cat-coffee', 'Ice Coffee Area', 'Signature cold brewed espresso with velvety heavy sweet milk foam and organic sugar reduction.', 15000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['Area Favorite', 'Sweet Creamy'], 'active', TRUE, TRUE, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Inventory for items
INSERT INTO inventory (id, name, description, sku, current_stock, min_stock, category, unit) VALUES
('inv-1', 'Grilled Chicken Stock', 'Main Cold Deck', 'menu-grilled-chicken', 15, 4, 'Entree', 'pcs'),
('inv-3', 'Chicken & Chips Stock', 'Hot Pantry B', 'menu-chicken-chips', 0, 5, 'Entree', 'pcs'),
('inv-13', 'Ice Coffee Area Stock', 'Barista Counter A', 'menu-coffee-area', 50, 10, 'Beverage', 'pcs')
ON CONFLICT (id) DO NOTHING;

-- Seed Theme Settings
INSERT INTO theme_settings (key, value) VALUES
('active_theme', 'midnight_gold')
ON CONFLICT (key) DO NOTHING;
`}};export{A as C,ae as T,se as a,g as b};
