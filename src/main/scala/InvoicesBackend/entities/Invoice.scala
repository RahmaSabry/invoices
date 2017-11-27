package InvoicesBackend.entities

case class Invoice(id: String, clientName: String, address: String,date:String,phoneNumber:String,items:Array[Items])
