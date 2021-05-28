'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;
        return res.status(200).send({
            hola,
            Proyecto: "Pagina de Casas Pinilla",
            Descripción: "Videos y fotos de la familia"
        })
    },
    test: (req, res) => {
        return res.status(200).send({
            message: "Soy la acción test de mi controlador de artículos"
        });
    },

    save: (req, res) => {
        //recoger parametros por POST
        var params = req.body;

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (e) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        if (validate_title && validate_content) {
            //Crear objeto a guardar
            var article = new Article();


            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null

            //Guardar artículo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "El artículo no se ha guardado"
                    })
                }
                //Decvolver respuesta.
                return res.status(200).send({
                    status: "success",
                    article: articleStored
                });

            })


        } else {
            return res.status(200).send({
                status: "error",
                message: "Los datos no son válidos"
            });
        }


    },

    getArticles: (req, res) => {
        var query = Article.find({})
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        //find
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los artículos."
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay artículos"
                });
            }
            return res.status(200).send({
                status: "success",
                articles
            });
        })


    },

    getArticle: (req, res) => {
        //recoger Id
        var articleId = req.params.id;

        //Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe el artículo"
            });
        }

        //Buscar el artículo y devolver la respuesta
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el articulo"
                });
            }


            return res.status(200).send({
                status: "success",
                article
            });
        });
    },

    update: (req, res) => {
        //Recoger id por la URL
        var articleId = req.params.id;


        //Recoger datos por PUT
        var params = req.body;

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        if (validate_content && validate_title) {
            //FindAndUpdate
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "No se ha podido actualizar el artículo"
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "No existe el articulo"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    article: articleUpdated
                });
            });

        } else {
            return res.status(404).send({
                status: "error",
                message: "La validación no es correcta"
            });
        }
    },

    delete: (req, res) => {
        //Recoger el id del articulo
        var articleId = req.params.id;

        //Find and Delete
        Article.findByIdAndDelete({ _id: articleId }, (err, articleDeleted) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if (!articleDeleted) {
                return res.status(404).send({
                    status: 'error',
                    essage: 'No se encuentra el artículo a borrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleDeleted
            });
        });
    },

    upload: (req, res) => {
        //Configurar modulo connect-multiparty router/experiencia.js (Hecho)

        //Recoger el fichero de la petición
        var file_name = 'imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }


        //Conseguir nombre y extensión

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');



        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        //Nombre del archivo
        var file_name = file_split[2];

        //Extensión del archivo
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //Comprobar la extensión (sólo imagenes)
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            //borrar el fichero
            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: "La extensión " + file_ext + " no es válida"

                });
            });
        } else {
            //Si todo es válido
            var articleId = req.params.id;
            //Buscar artículo asignado al nombre de la imagey actualizarlo

            if (articleId) {
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: "Error al subir la imagen"
                        });
                    }
                    return res.status(200).send({
                        status: "success",
                        article: articleUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    "status": 'success',
                    "image": file_name,
                    "message": "Todo correcto",
                    "extension": file_ext
                })
            }
        }
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            } else {
                return res.status(404).send({
                    status: 'error',
                    path_file
                });
            }
        })
    },

    search: (req, res) => {
        //Sacar String a buscar
        var searchString = req.params.search;

        //find or
        Article.find({
                "$or": [
                    { "title": { "$regex": searchString, "$options": "i" } },
                    { "content": { "$regex": searchString, "$options": "i" } }
                ]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición',
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha encontrado nada',
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            })

    }
};

module.exports = controller;