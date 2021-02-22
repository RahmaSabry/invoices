package InvoicesBackend.services
import slick.dbio.Effect
import slick.jdbc.H2Profile
import slick.jdbc.H2Profile.api._
import slick.sql.FixedSqlAction
import InvoicesBackend.entities._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Success

class SlickService {
  case class User(id :Int, username:String)
  class Users(tag: Tag) extends Table[User](tag, "users") {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)
    def username = column[String]("USERNAME")
    def * = (id, username) <> (User.tupled, User.unapply)
  }
  class Invoices(tag: Tag) extends Table[Invoice](tag, "invoices") {
    def invoiceID = column[Long]("invoiceID", O.PrimaryKey, O.AutoInc)
    def clientName = column[String]("clientName")
    def address = column[String]("address")
    def date = column[String]("date")
    def phoneNumber = column[String]("phoneNumber")
    def  * = (invoiceID, clientName,address,date,phoneNumber) <> ((Invoice.apply _).tupled, Invoice.unapply)
  }

  class Items(tag:Tag) extends Table[Item](tag,"items"){
    def itemID=column[Long]("itemID",O.PrimaryKey,O.AutoInc)
    def itemName = column[String]("itemName")
    def price =column[Double]("price")
    def * = (itemID,itemName,price) <> ((Item.apply _).tupled, Item.unapply)
  }
  class InvoiceItems(tag:Tag) extends Table[ItemInvoice](tag,"itemInvoice")
  {
    def invoiceID = column[Long]("invoiceID")
    def itemID = column[Long]("itemID")
    def * =(invoiceID,itemID) <>((ItemInvoice.apply _).tupled, ItemInvoice.unapply)
    def pk =primaryKey("primaryKey",(invoiceID,itemID))
    def invoiceFK=foreignKey("FK_INVOICE",invoiceID,TableQuery[Invoices])(_.invoiceID,onDelete =ForeignKeyAction.Cascade)
    def itemFK=foreignKey("FK_ITEM",invoiceID,TableQuery[Items])(item=>item.itemID)
  }


  val db = Database.forConfig("slickDb")
  val users = TableQuery[Users]
  val invoice=TableQuery[Invoices]
  val items=TableQuery[Items]
  val invoiceItems=TableQuery[InvoiceItems]
  def schema =users.schema
  val userMap=users.map(user => (user.id, user.username))
  val invoiceMap=invoice.map(invoice=>(invoice.invoiceID,invoice.clientName,invoice.address,invoice.date,invoice.phoneNumber))
  val seqSchema=DBIO.seq(userMap+= (0, "Rahma"),userMap+= (0, "ahmed"),userMap+= (0, "mohammed"),invoiceMap ++=Seq((0,"a","d","d","d"),(0,"b","d","d","d"),(0,"c","d","d","d")),
  items.map(item=>(item.itemID,item.itemName,item.price))++=Seq((0,"lapTop",10000),(0,"Mouse",500),(0,"Mobile Phone",5000)),
    invoiceItems.map(ii=>(ii.invoiceID,ii.itemID))++=Seq((1,1),(1,2),(2,3),(2,1)))
  val session =db.createSession()
  for(s <- schema.drop.statements ++schema.create.statements++invoice.schema.create.statements++items.schema.create.statements++invoiceItems.schema.create.statements) {
    try {
      session.withPreparedStatement(s)(_.execute)
    } catch {
      case e: Throwable => e
    }
  }
  db.run(seqSchema)
  def insertUser(): Future[User] = {
      val insertQuery=users returning users.map(_.id) into ((user, id) => user.copy(id = id))+= User(1, "Rahma")
      db.run(insertQuery)
  }
  def getUser(id:Int): Future[Option[User]] =
    {
      db.run(users.filter(_.id === id).result).map(_.headOption)
    }
  def updateUser(id:Int)={
    db.run(users.filter(_.id === id).update(User(id,"hussien")))
  }
  def deleteUser(id: Int): Future[Int] = {
      db.run(users.filter(_.id === id).delete)
    }
  def getInvoiceWithItems(id:Long)= {
    val getInvoiceQ= for {
      (invoice, itemsInvoice) <- invoice join (invoiceItems join items on(_.itemID === _.itemID)) on (_.invoiceID===_._1.invoiceID) filter(_._1.invoiceID === id)
    } yield (invoice,itemsInvoice)
    val InvoiceSeq: Future[Seq[(Invoice, (ItemInvoice, Item))]] = db.run(getInvoiceQ.result)
   val result: Future[Map[Invoice, Seq[Item]]] = InvoiceSeq flatMap{
      case seq=>Future{seq.groupBy(_._1) map {
        case (invoice,invoiceWithItems)=>(invoice,invoiceWithItems.map(_._2._2))
      }}
      }
    val invoiceR: Future[InvoiceWithItems] = result.flatMap(map=>Future{InvoiceWithItems(map.keySet.toList(0),map(map.keySet.toList(0)))})
    invoiceR
    }
  def getAllInvoiceWithItems()={
    val getAllInvoiceQ=invoice joinLeft(invoiceItems join items on (_.itemID === _.itemID)) on (_.invoiceID === _._1.invoiceID)
    val res: Future[Seq[(Invoice, Option[(ItemInvoice, Item)])]] = db.run(getAllInvoiceQ.result)
    val result: Future[Map[Invoice, Seq[Option[Item]]]] =res flatMap{
      case seq =>Future{
        seq.groupBy(_._1) map {
          case (invoice,invoiceWithItems)=>(invoice,invoiceWithItems.map(_._2 map(_._2)))
        }
      }
    }
    result flatMap(map=>Future{map.keySet.toList.map(invoice=>InvoiceWithItemsOption(invoice,map(invoice)))})
  }
}

