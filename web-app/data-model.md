# Modeli fillestar i të dhënave

## Objekt
- object_id
- client_id
- address
- project_id
- status

## Produkt
- product_id
- product_type
- serial_number
- installation_date
- warranty_id

## Aset/Pajisje
- asset_id
- object_id
- manufacturer
- model
- serial_number
- status

## Garanci
- warranty_id
- product_id / asset_id
- start_date
- end_date
- status
- terms_reference

## Kërkesë shërbimi
- service_id
- object_id / asset_id
- client_id
- created_at
- priority
- description
- status
- assigned_technician

## Ndërhyrje
- intervention_id
- service_id
- technician
- start/end
- diagnosis
- work_performed
- parts_used
- attachments
- result

## QR
- qr_id
- target_type
- target_id
- public_token
- status
- created_at
