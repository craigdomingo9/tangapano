from systems import PostgresMegaSystem


def main():
    
    systems = [
        PostgresMegaSystem(),
    ]
    
    for system in systems:
        system.run_cycle()
        
    
if __name__ == "__main__":
    main()


