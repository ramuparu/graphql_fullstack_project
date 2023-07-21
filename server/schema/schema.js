// const { projects , clients } = require("../sampleData");
const Project = require('../models/Project')
const Client = require('../models/Client')


const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql')

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        },

    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        AllProjects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
        Allclients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        AddCreateUser: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        //delete client
        DeleteClient: {
            type: ClientType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id)
            }
        },
        //Add Projects
        AddProjects: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            new: { value: "Not Started" },
                            progress: { value: "In Progress" },
                            complete: { value: "Completed" },
                            done: { value: "Done" }
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return project.save()
            }
        },
        //delete project

        DeleteProject: {
            type: ProjectType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },
        //update project

        UpdateProject: {
            type : ProjectType,
            args : {
                id : {type : GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatusUpdate",
                        values: {
                            new: { value: "Not Started" },
                            progress: { value: "In Progress" },
                            complete: { value: "Completed" },
                            done: { value: "Done" }
                        }
                    })
                }
                
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(args.id,{
                    $set : {
                        name : args.name,
                        description : args.description,
                        status : args.status
                    }
                },
                {new : true}
                )
            }
        }
    }

})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

