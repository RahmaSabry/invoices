package InvoicesBackend.entities

case class Invoice(id: Int, clientName: String, address: String,date:String,phoneNumber:String,items:Array[Items])
