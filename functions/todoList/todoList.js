const { ApolloServer, gql } = require('apollo-server-lambda')

const faunadb = require('faunadb')
const q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
      addTodo(task: String!, status: Boolean!): Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
    Query: {
        todos: async (root, args, context) => {
            try{
                var adminClient = new faunadb.Client({secret: 'fnAD64BRW_ACASF96s3TU7Wwpdpnk8TPU_Dx2eO4'});
                const result = await adminClient.query(
                    q.Map(q.Paginate(q.Match(q.Index('all_todos'))), q.Lambda(x => q.Get(x)))
                )
                console.log('DATA: ',result);
                return result.data.map(d => ({
                    id: d.ts,
                    status: d.data.status,
                    task: d.data.task
                }))
            }catch(err){
                console.log(err);
            }
        },
    },
    Mutation: {
        addTodo: async (_, { task, status }) => {
            const adminClient = new faunadb.Client({ secret: 'fnAD64BRW_ACASF96s3TU7Wwpdpnk8TPU_Dx2eO4' });
            const result = await adminClient.query(
                q.Create(
                    q.Collection('todos'), {
                        data: {
                            task,
                            status
                        }
                    }
                )
            )
            return result.ref.data;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
