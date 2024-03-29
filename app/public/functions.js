$(document).ready(
    () => {
        function scoretest(id, ans, count) {

            $.ajax({
                method: "GET",
                url: "http://localhost:3000/questions/" + id,
                async: false,
                success: (data) => {
                    if (ans == data["ropt"]) {
                        count = count + 1;
                    }
                }
            })
            return count;

        }

        quiztitle = (id) => {
            let title = '';
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/quiz/" + id,
                async: false,
                success: (data) => {
                    title = data['title'];
                }
            })
            return title;
        }

        $('#testing').on('submit', (e) => {
            e.preventDefault();
            var score = 0;
            let qty = ($('#testing  input[type=radio]').length) / 3;
            let count = qty;

            $('#testing  input[type=radio]:checked').each(function() {
                count--;


                score = scoretest($(this).attr('name'), $(this).val(), score);

            });
            $('.modal-body').html((score * 100 / qty) + '%');


        })
        qdelete = (id) => {
            if (confirm('Click Ok to proceed else Click Cancel')) {
                $.ajax({
                    method: "DELETE",
                    url: "http://localhost:3000/questions/" + id,
                    success: (data) => {
                        quizes();
                        taketest(id);

                    }
                })
            }
        }

        qedit = (id) => {
            $('#questionform').show();
            $('#editmenu').show();
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/questions/" + id,
                success: (data) => {
                    $('#ques1e').val(data['ques1']);
                    $('#ropte').val(data['ropt']);
                    $('#1opte').val(data['opt1']);
                    $('#2opte').val(data['opt2']);
                    $('#editqide').val(data['id']);
                    $('#rqide').val(data['qid']);
                    $('#editform').hide();
                }
            })
        }
        $('#questionform').on('submit', (e) => {
            e.preventDefault();
            let qid = $('#rqide').val();
            let id = $('#editqide').val();
            let ques1 = $('#ques1e').val();
            let ropt = $('#ropte').val();
            let opt1 = $('#1opte').val();
            let opt2 = $('#2opte').val();
            let data = { qid, ques1, ropt, opt1, opt2 };
            $.ajax({
                method: "PUT",
                url: "http://localhost:3000/questions/" + id,
                dataType: 'JSON',
                data: data,
                success: () => {
                    taketest($('#rqide').val());
                    $('#egood').show();
                    $('#alerteg').html('Question Updated!');
                    $('#2opte').val('');
                    $('#1opte').val('');
                    $('#ropte').val('');
                    $('#ques1e').val('');
                    let qid = $('#rqide').val('');
                    $('#questionform').hide();
                }
            })
        });


        action = (act, id) => {
            if (act == 'edit') {
                $('#editmenu').show();
                $.ajax({
                    method: "GET",
                    url: "http://localhost:3000/quiz/?id=" + id,
                    success: (data) => {
                        console.log(data[0]['title'], data[0]['code'], data[0]['category']);
                        $('#edittitle').val(data[0]['title']);
                        $('#editcode').val(data[0]['code']);
                        $('#editCategory').val(data[0]['Category']);
                        $('#editqid').val(data[0]['id']);
                    }
                })
            }
            if (act == 'delete' && confirm('Click Ok to delete Picture else Click cancel')) {
                $.ajax({
                    method: "DELETE",
                    dataType: "JSON",
                    url: "http://localhost:3000/quiz/" + id,
                    success: () => {
                        $('#good').show();
                        $('#alertcg').html('Quiz Deleted!');
                        quizes();
                    }
                })
            }
            if (act == 'take') {

                taketest(id);

                $('#testingtitle').html(quiztitle(id));
                $('.modal-title').html(quiztitle(id));
            }
            if (act == 'add') {
                $('#testing').html('Add Questions to Quiz');
                $('#quiztitle').html(quiztitle(id));
                $('#qid').val(id);
                $('#adder').show();
                $('#cquiz').show();
                $('#equiz').hide();
                $('#next').hide();

            }
        };

        taketest = (id) => {
            let html = '';
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/questions/?qid=" + id,
                success: (data) => {
                    if (data.length > 0) {
                        for (let i = 1; i < data.length + 1; i++) {
                            let arr = [data[i - 1]['ropt'], data[i - 1]['opt1'], data[i - 1]['opt2']];
                            rand = (arr) => {
                                var narr;
                                let x = Math.floor(Math.random() * 2);
                                if (x == 2) { narr = [2, 0, 1]; } else if (x == 1) { narr = [1, 2, 0]; } else { narr = [0, 2, 1]; }
                                return narr;
                            }
                            let order = rand(arr);

                            html += `<p><small><i class='btn btn-primary fas fa-edit' onclick='qedit(${data[i-1]['id']})'></i><i class='btn btn-primary fas fa-trash-alt' onclick='qdelete(${data[i-1]['id']})'></i></small></p>
                        <strong><i>${data[i-1]['ques1']}</i></strong>
                        <div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[0]]}' name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[0]]}</label></div><div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[1]]}' name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[1]]}</label></div><div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[2]]}'  name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[2]]}</label></div>
</div>`;

                        }
                        html += `<button  name='mark' type='submit' class="btn btn-success col-12" data-toggle='modal' data-target='#testscore'>Submit</button>`;
                        $('#testing').html(html);


                    } else {
                        $('#testing').html('Add Questions to Quiz');
                        $('#qid').val(id);
                        $('#adder').show();
                        $('#cquiz').show();
                        $('#equiz').hide();
                        $('#next').hide();
                    }
                }
            });

        }

        pubquizes = () => {
            let html = '';
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/quiz/?Category=Public",
                success: (data) => {

                    for (let i = 1; i < data.length + 1; i++) {


                        html += `<tr>
<th scope="row">${i}</th>
<td>${data[i-1]['title']}</td>
<td><button onclick="takepublic(${data[i-1]['id']})"  class='btn btn-warning'>TAKE</button></td></tr>`;

                    }
                    $('#testing').html(html);


                }
            });

        }

        takepublic = (id) => {
            let html = '';
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/questions/?qid=" + id,
                success: (data) => {
                    if (data.length > 0) {
                        for (let i = 1; i < data.length + 1; i++) {
                            let arr = [data[i - 1]['ropt'], data[i - 1]['opt1'], data[i - 1]['opt2']];
                            rand = (arr) => {
                                var narr;
                                let x = Math.floor(Math.random() * 2);
                                if (x == 2) { narr = [2, 0, 1]; } else if (x == 1) { narr = [1, 2, 0]; } else { narr = [0, 2, 1]; }
                                return narr;
                            }
                            let order = rand(arr);

                            html += `
                        <strong><i>${data[i-1]['ques1']}</i></strong>
                        <div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[0]]}' name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[0]]}</label></div><div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[1]]}' name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[1]]}</label></div><div class="form-check">
<input type='radio' class="form-check-input" value='${arr[order[2]]}'  name="${data[i-1]['id']}"><label class="form-check-label"> ${arr[order[2]]}</label></div>
</div>`;

                        }
                        let xhtml = `<h2>${quiztitle(id)}</h2>` + html + `<button  name='mark' type='submit' class="btn btn-success col-12" data-toggle='modal' data-target='#testscore'>Submit</button>`;
                        $('#testing').html(xhtml);


                    } else {
                        $('#testing').html('Add Questions to Quiz');
                    }


                }
            })
        }

        quizes = () => {
            let html = '';
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/quiz/?email=" + $('#useremail').val(),
                success: (data) => {
                    for (let i = 1; i < data.length + 1; i++) {

                        html += `<tr>
<th scope="row">${i}</th>
<td>${data[i-1]['title']}</td>
<td><button onclick="action (this.id,'${data[i-1]['id']}')" id='edit' class='btn btn-info edit'>EDIT</button></td>
<td><button onclick="action (this.id,'${data[i-1]['id']}')" id='take' class='btn btn-warning'>TAKE</button><td><button onclick="action(this.id,'${data[i-1]['id']}')" id='delete' class='btn btn-danger'>DELETE</button></td>
<td><button onclick="action(this.id,'${data[i-1]['id']}')" id='add' class='btn btn-secondary'>ADD</button></td></tr>`;

                    }
                    $('#quizlog').html(html);


                }
            });

        }

        function quizid() {
            $.ajax({
                method: "GET",
                url: "http://localhost:3000/quiz/",
                success: (data) => {
                    $('#quiztitle').html(data[data.length - 1]['title']);
                    $('#qid').val(data.length);

                }
            });
        }
        $('#editform').on('submit', (e) => {
            e.preventDefault();
            let title = $('#edittitle').val();
            let code = $('#editcode').val();
            let category = $('#editCategory').val();
            let id = $('#editqid').val();
            let email = $('#editemail').val();
            let data = { title, code, category, email };
            $.ajax({
                method: "PUT",
                dataType: "JSON",
                url: "http://localhost:3000/quiz/" + id,
                data: data,
                success: () => {
                    $('#egood').show();
                    $('#alerteg').html('Quiz Edited!');
                    $('#editform').hide();
                    $('#edittitle').val('');
                    $('#editcode').val('');
                    $('#editCategory').val('');
                    quizes();
                }
            })

        });
        $('#adder').on('submit', (e) => {
            e.preventDefault();
            let qid = $('#qid').val();
            let ques1 = $('#ques1').val();
            let ropt = $('#ropt').val();
            let opt1 = $('#1opt').val();
            let opt2 = $('#2opt').val();
            let opt3 = $('#opt3').val();
            let data = { qid, ques1, ropt, opt1, opt2, opt3 };
            $.ajax({
                method: "POST",
                url: "http://localhost:3000/questions",
                dataType: 'JSON',
                data: data,
                success: () => {
                    $('#good').show();
                    $('#alertcg').html('Question added!');
                    $('#ques1').val('');
                    $('#qid').val(qid);
                    $('#1opt').val('');
                    $('#2opt').val('');
                    $('#3opt').val('');
                    $('#ropt').val('');
                }
            })
        });
        $('#ques1').on('change', e => {
            $('#good').hide();
        });
        $('#next').on('submit', (e) => {
                e.preventDefault();
                let title = $('#title').val();
                let code = $('#code').val();
                let Category = $('#Category').val();
                let email = $('#useremail').val();
                let data = { title, code, Category, email };
                $.ajax({
                        method: "POST",
                        url: "http://localhost:3000/quiz",
                        dataType: 'JSON',
                        data: data,
                        success: (data) => {
                            quizid();
                            $('#qid').val(data.id);
                            $('#adder').show();

                            $('#next').hide();
                            $('#title').val('');
                            $('#code').val('');
                            $('#Category').val('');
                        }


                    }

                )
            }

        );
        $('#sform').on('submit', (e) => {
            $('#error').hide();
            e.preventDefault();
            var dg = ['zero', 'one', 'two', 'three', 'four',
                'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
            ];
            if (dg[$('#authvalues').val()] === $('#auths').val()) {
                $('#error').hide();
                let fname = $('#fname').val();
                let lname = $('#lname').val();
                let phone = $('#phone').val();
                let email = $('#semail').val();
                let pwd = $('#spassword').val();
                let Category = $('#Category').val();
                $.ajax({
                    method: "GET",
                    url: "http://localhost:3000/access?email=" + email,
                    success: (data) => {
                        console.log(data);

                        if (data.length > 0) {
                            $('#error').show();
                            $('#alertc').html('Email Already exits!Please Login');
                        } else {

                            let data = { fname, lname, phone, Category, email, pwd };
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:3000/access",
                                dataType: 'JSON',
                                data: data,
                                success: () => {
                                    sessionStorage.setItem("s_email", email);
                                    window.location = './app/dashboard.html?email=' + email
                                }

                            })

                        }
                    }

                })

            } else {
                $('#error').show();
                $('#alertc').html('Invalid Authentication');
            }
        })
        $('#lform').on('submit', (e) => {
            e.preventDefault();
            var dg = ['zero', 'one', 'two', 'three', 'four',
                'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
            ];
            if (dg[$('#authvaluel').val()] === $('#authl').val()) {
                let email = $('#lemail').val();
                let pwd = $('#lpassword').val();
                $.ajax({
                    method: "GET",
                    url: "http://localhost:3000/access?email=" + email,
                    dataType: 'JSON',
                    success: (data) => {
                        if (data.length > 0) {
                            console.log(data[0]['pwd'] === pwd);
                            if (data[0]['pwd'] === pwd) {
                                window.location = './app/dashboard.html?email=' + email
                            } else {
                                $('#error').show();
                                $('#alertc').html('Invalid Password');
                            }
                        } else {
                            $('#error').show();
                            $('#alertc').html('Invalid Email');
                        }
                    }

                })

            } else {
                $('#error').show();
                $('#alertc').html('Invalid Authentication');
            }
        })
        let title = window.location.pathname.split('/');
        title = title[title.length - 1];
        title = title.replace('.html', '');
        if (title == 'index') { title = 'Home'; }
        console.log(title);
        $('title').html(`${title}-Eagle Quiz!`);
        $('#data').on('click',
            () => {
                $('#editform').hide();
                $('#questionform').show();
            })
        $('#questions').on('click',
            () => {
                $('#editform').show();
                $('#questionform').hide();
            })
        $('#coption').on('click',
            () => {
                $('#equiz').hide();
                $('#cquiz').show();
                $('#next').show();
                $('#adder').hide();
            })
        $('#eoption').on('click',
            () => {
                quizes();
                $('#equiz').show();
                $('#cquiz').hide();
            })
        $('#loption').on('click',
            () => {
                $('#sform').hide();
                $('#lform').show();
                auth();
            })
        $('#soption').on('click',
            () => {
                $('#sform').show();
                $('#lform').hide();
                auth();
            })

        function auth() {
            $('#error').hide();
            let xout = Math.floor(Math.random() * 20);
            var dg = ['zero', 'one', 'two', 'three', 'four',
                'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
            ];
            $('#auths').val(dg[xout]);
            $('#authl').val(dg[xout]);


            function checkout() {
                $('#authvalues').on('change', () => {

                    if ($('#authvalues').val() == xout) {

                        $('#signup').attr("disabled", "enabled");
                    } else {
                        $('#signup').attr("disabled", "enabled");
                        alert("" + +xout);
                    }

                })

            }
        }
        auth();

        var pos = document.location.toString().indexOf('=');
        if (pos !== -1) {
            var query = document.location
                .toString().split('').slice(pos + 1, document.location
                    .toString().split('').length);
            query = query.join('');
            for (var i = 0; i < $("input[type='email']").length; i++) {

                if (query.split(''.includes('@'))) {
                    quizes();
                    document.getElementById($("input[type='email']")[i].id).value = query;
                };
            }


        } else { pubquizes(); }

    }


);




//get the 'index' query parameter