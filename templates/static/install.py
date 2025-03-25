import subprocess
import sys
import time
 
libraries = [
    'flask',
    'pymysql',
    'flask_mysqldb',

]



def custom_shape_progress_bar(total, progress):
    bar_length = 50
    filled_lenth = int(round(bar_length * progress / float(total)))
    percents = round(100.0 * progress / float(total), 1)
    bar = '▋' * filled_lenth + ' ' * (bar_length - filled_lenth)
    sys.stdout.write(f'\r[{bar}] {percents}% 进度')
    sys.stdout.flush()
 
def install_libraries():
    total = len(libraries)
    for i, library in enumerate(libraries, start=1):
        try:
            subprocess.check_call(['pip', 'install', library])
            print(f'\n成功安装 {library} 库')
        except subprocess.CalledProcessError:
            print(f'\n{library} 库安装失败')
            custom_shape_progress_bar(total, i)
            time.sleep(0.1)
    print('\n全部库安装完成')
if __name__ == '__main__':
    install_libraries()