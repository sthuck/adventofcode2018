project(adventofcode)
set(HEADER_FILES
        day1.h
        common.h
        )

set(SOURCE_FILES
        day1.c
        common.c)

find_package(PkgConfig REQUIRED)
pkg_search_module(GLIB REQUIRED glib-2.0)

add_library(adventofcode STATIC ${SOURCE_FILES} ${HEADER_FILES})
target_compile_options(adventofcode PUBLIC -Wall -Wextra -Werror -Wpedantic)
target_include_directories(adventofcode PRIVATE ${GLIB_INCLUDE_DIRS})
target_link_libraries(adventofcode ${GLIB_LDFLAGS})