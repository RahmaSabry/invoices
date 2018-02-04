package InvoicesBackend.services

import InvoicesBackend.entities.Users
import InvoicesBackend.routing.MyResource
import scala.concurrent.{ExecutionContext, Future}
import io.getquill._

class UserService(implicit val executionContext: ExecutionContext) extends MyResource {
  lazy val ctx = new H2JdbcContext(CamelCase, "db")
  var users = Vector.empty[Users]
  import ctx._
  users =users:+Users("rahma","a@gmail.com","rahma"):+Users("roka","a@gmail.com","rahma")
  def register(user: Users): Future[Option[String]] = Future {
    users.find(_.userName == user.userName) match {
      case Some(q) => None
      case None => {
        users = users :+ user
        val q = quote (query[Users].insert(lift(user)))
        ctx.run(q)
      }
        Some(user.userName)
    }
  }
  def findUser(userName:String):Option[Users]  =
  {
    val getUser = quote{query[Users].filter(user=> user.userName == lift(userName))}
    ctx.run(getUser).headOption
  }
  def authenticate(userName: String,password:String): logInResponse= {

    if (userName == "" && password == "") logInResponse(401, "Empty credentials")
    else {
      users.find(_.userName == userName).filter(_.password == password) match{
        case Some(user)=>logInResponse(200, userName)
        case None=>logInResponse(401, "Wrong credentials")
      }
    }
  }
  case class logInResponse(status:Int,message:String)
}
