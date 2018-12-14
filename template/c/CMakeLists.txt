cmake_minimum_required(VERSION 3.12)
project(adventofcode-runner)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 14)

add_subdirectory(adventofcode)
include_directories(adventofcode)
add_subdirectory(tests)

add_executable(main main.c)
target_link_libraries(main adventofcode)
