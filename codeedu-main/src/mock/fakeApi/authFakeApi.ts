import { mock } from '../MockAdapter'
import { signInUserData } from '../data/authData'
import { coursesData } from '../data/courseData'


mock.onPost(`/sign-in`).reply((config) => {
    const data = JSON.parse(config.data as string) as {
        email: string
        password: string
    }

    const { email, password } = data

    const user = signInUserData.find(
        (user) => user.email === email && user.password === password,
    )

    if (user) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve([
                    201,
                    {
                        user,
                        token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
                    },
                ])
            }, 800)
        })
    }

    return [401, { message: 'Invalid email or password!' }]
})

mock.onPost(`/sign-up`).reply((config) => {
    const data = JSON.parse(config.data as string) as {
        email: string
        password: string
        userName: string
    }

    const { email, userName } = data

    const emailUsed = signInUserData.some((user) => user.email === email)
    const newUser = {
        avatar: '',
        userName,
        email,
        authority: ['admin', 'user'],
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            if (emailUsed) {
                resolve([400, { message: 'User already exist!' }])
            }

            resolve([
                201,
                {
                    user: newUser,
                    token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
                },
            ])
        }, 800)
    })
})

mock.onPost(`/reset-password`).reply(() => {
    return [200, true]
})

mock.onPost(`/forgot-password`).reply(() => {
    return [200, true]
})

mock.onPost(`/sign-out`).reply(() => {
    return [200, true]
})


// coursesFakeApi data

mock.onGet(`/courses`).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, {
                data: {
                    courses: coursesData,
                },
                message: 'success',
                status: 200,
                error: [],
            }])
        }, 800)
    })
})

// Get course by id

mock.onGet(/\/courses\/\d+\/modules\/\d+/).reply((config) => {
    const urlParts = config.url?.split('/');
    const courseId = parseInt(urlParts?.[2] || '', 10); // Extract course ID
    const moduleId = parseInt(urlParts?.[4] || '', 10); // Extract module ID
    const course = coursesData.find((course) => course.id === courseId);
    if (course) {
        const module = course.modules.find((module) => module.id === moduleId);
        if (module) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve([
                        200,
                        {
                            data: {
                                courseDetails: {
                                    id: course.id,
                                    title: course.title,
                                    description: course.description,
                                    image: course.image,
                                    price: course.price,
                                    rating: course.rating,
                                    level: course.level,
                                    liked: course.liked,
                                },
                                moduleDetails: module,
                            },
                            message: 'success',
                            status: 200,
                            error: [],
                        },
                    ]);
                }, 800);
            });
        }

        return [
            404,
            {
                message: 'Module not found!',
                status: 404,
                error: ['Invalid module ID'],
            },
        ];
    }

    return [
        404,
        {
            message: 'Course not found!',
            status: 404,
            error: ['Invalid course ID'],
        },
    ];
});

mock.onGet(/\/courses\/\d+/).reply((config) => {
    const courseId = parseInt(config.url?.split('/').pop() || '', 10);
    const course = coursesData.find((course) => course.id === courseId);
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (course) {
                resolve([
                    200,
                    {
                        data: course,
                        message: 'success',
                        status: 200,
                        error: [],
                    },
                ]);
            } else {
                resolve([
                    404,
                    {
                        message: 'Course not found!',
                        status: 404,
                        error: ['Invalid course ID'],
                    },
                ]);
            }
        }, 800);
    });
});



mock.onGet(`/courses/continue-reading`).reply(() => {
    const courseIds: number[] = JSON.parse(localStorage.getItem('continueReadingIds') || '[]');
    const continueReadingCourses = coursesData.filter((course) => courseIds.includes(course.id));
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                200,
                {
                    data: {
                        courses: continueReadingCourses,
                    },
                    message: 'success',
                    status: 200,
                    error: [],
                },
            ]);
        }, 800);
    });
});
